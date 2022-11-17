ALTER PROCEDURE [rule].[rule.merge]
    @condition [rule].conditionTT READONLY,
    @conditionActor [rule].conditionActorCustom READONLY,
    @conditionItem [rule].conditionItemCustom READONLY,
    @conditionProperty [rule].conditionPropertyCustom READONLY,
    @limit [rule].limitCustom READONLY,
    @splitName [rule].splitNameCustom READONLY,
    @splitRange [rule].splitRangeCustom READONLY,
    @splitAssignment [rule].splitAssignmentCustom READONLY,
    @splitAnalytic [rule].splitAnalyticCustom READONLY,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @callParams XML
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @conditionTT [rule].conditionTT
BEGIN TRY

    INSERT INTO @conditionTT(priority, operationStartDate, operationEndDate, sourceAccountId, destinationAccountId, name, description, notes)
    SELECT co.priority, co. operationStartDate, co. operationEndDate, co. sourceAccountId, co. destinationAccountId, co. name, co. description, co. notes
    FROM @condition co
    LEFT JOIN [rule].condition c ON (c.name = co.name OR c.priority = co.priority)
    WHERE c.priority IS NULL

    DECLARE @rules TABLE (ruleId INT, ruleName NVARCHAR(100))
    DECLARE @ruleSplitNames TABLE (splitId INT, splitNm NVARCHAR(100), ruleId INT, ruleName NVARCHAR(100))

    BEGIN TRANSACTION

        MERGE INTO [rule].condition AS t
        USING @conditionTT AS s ON 1 = 0
        WHEN NOT MATCHED BY TARGET THEN
            INSERT ([priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId,
                [name], [description], notes, createdOn, createdBy)
            VALUES (s.[priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId,
                [name], [description], notes, GETUTCDATE(), ISNULL(createdBy, @userId))
        OUTPUT INSERTED.conditionId, s.name INTO @rules(ruleId, ruleName);

        INSERT INTO [rule].conditionActor (conditionId, factor, actorId)
        SELECT ruleId, factor, actorId
        FROM @conditionActor
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].conditionItem (conditionId, factor, itemNameId)
        SELECT ruleId, factor, itemNameId
        FROM @conditionItem
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].conditionProperty (conditionId, factor, name, value)
        SELECT ruleId, factor, name, value FROM @conditionProperty
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].limit (conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily,
            maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
        SELECT ruleId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily,
            maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority]
        FROM @limit
        JOIN @rules ON ruleName = conditionName

        MERGE INTO [rule].splitName AS t
        USING
        (
            SELECT ruleId, ruleName, s.name, s.tag
            FROM @splitName s
            JOIN @rules ON conditionName = ruleName
        ) AS s ON 1 = 0
        WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, name, tag)
            VALUES (s.ruleId, s.name, s.tag)
        OUTPUT INSERTED.splitNameId, INSERTED.name, s.ruleId, s.ruleName INTO @ruleSplitNames(splitId, splitNm, ruleId, ruleName);

        INSERT [rule].splitRange (splitNameId, startAmount, startAmountCurrency, startAmountDaily, startCountDaily,
            startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly,
            isSourceAmount, minValue, maxValue, [percent], percentBase)
        SELECT n.splitId, r.startAmount, r.startAmountCurrency, r.startAmountDaily, r.startCountDaily,
            r.startAmountWeekly, r.startCountWeekly, r.startAmountMonthly, r.startCountMonthly,
            r.isSourceAmount, r.minValue, r.maxValue, r.[percent], r.percentBase
        FROM @splitRange r
        JOIN @ruleSplitNames n On n.splitNm = r.splitName AND n.ruleName = r.conditionName

        INSERT [rule].splitAssignment (splitNameId, debit, credit, minValue, maxValue, [percent], description)
        SELECT n.splitId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description
        FROM @splitAssignment r
        JOIN @ruleSplitNames n On n.splitNm = r.splitName AND n.ruleName = r.conditionName

        INSERT [rule].splitAnalytic(splitAssignmentId, [name], [value])
        SELECT a.splitAssignmentId, r.[name], r.[value]
        FROM @splitAnalytic r
        JOIN @ruleSplitNames n ON n.splitNm = r.splitName AND n.ruleName = r.conditionName
        JOIN [rule].splitAssignment a ON a.splitNameId = n.splitId AND r.splitAssignmentDescription = a.description

    COMMIT TRANSACTION

    EXEC core.auditCall @procid = @@PROCID, @params = @callParams
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    DECLARE @errmsg NVARCHAR(2048)
    SET @errmsg = error_message() + CHAR(10) + '    at ' + ISNULL(OBJECT_SCHEMA_NAME(@@PROCID, DB_ID()) + '.' + OBJECT_NAME(@@PROCID, DB_ID()), '<SQL>') +
        ' (line:' + LTRIM(STR(ISNULL(error_line(), 1))) + ') errno:' + LTRIM(STR(ISNULL(error_number(), 0)))

    EXEC [core].[errorCall] @procId = @@PROCID, @params = @callParams, @error = @errmsg

    ;THROW;
END CATCH
