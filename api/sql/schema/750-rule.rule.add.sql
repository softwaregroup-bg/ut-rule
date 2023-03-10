ALTER PROCEDURE [rule].[rule.add]
    @condition [rule].conditionTT READONLY,
    @conditionActor [rule].conditionActorTT READONLY,
    @conditionItem [rule].conditionItemTT READONLY,
    @conditionProperty [rule].conditionPropertyTT READONLY,
    @limit [rule].limitTT READONLY,
    @rate [rule].rateTT READONLY,
    @split XML,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @splitName [rule].splitNameTT,
    @splitAssignment [rule].splitAssignmentTT,
    @conditionId INT
BEGIN TRY
    -- checks if the user has a right to make the operation
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF EXISTS
        (
            SELECT [name]
            FROM [rule].condition
            WHERE [name] = (SELECT [name] FROM @condition)
        )
        BEGIN
            RAISERROR ('rule.duplicatedName', 16, 1)
        END

    BEGIN TRANSACTION

        INSERT INTO [rule].condition (
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId,
            [name],
            [description],
            notes,
            createdOn,
            createdBy
            )
        SELECT
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId,
            [name],
            [description],
            notes,
            GETUTCDATE(),
            ISNULL(createdBy, @userId)
        FROM @condition;

        SET @conditionId = SCOPE_IDENTITY()

        INSERT INTO [rule].conditionActor
        (
            conditionId,
            factor,
            actorId
        )
        SELECT
            @conditionId,
            factor,
            actorId
        FROM @conditionActor

        INSERT INTO [rule].conditionItem
        (
            conditionId,
            factor,
            itemNameId
        )
        SELECT
            @conditionId,
            factor,
            itemNameId
        FROM @conditionItem

        INSERT INTO [rule].conditionProperty
        (
            conditionId,
            factor,
            name,
            value
        )
        SELECT
            @conditionId,
            factor,
            name,
            value
        FROM @conditionProperty

        INSERT INTO [rule].limit (
            conditionId,
            currency,
            minAmount,
            maxAmount,
            maxAmountDaily,
            maxCountDaily,
            maxAmountWeekly,
            maxCountWeekly,
            maxAmountMonthly,
            maxCountMonthly,
            [credentials],
            [priority]
        )
        SELECT @conditionId,
            [currency],
            [minAmount],
            [maxAmount],
            [maxAmountDaily],
            [maxCountDaily],
            [maxAmountWeekly],
            [maxCountWeekly],
            [maxAmountMonthly],
            [maxCountMonthly],
            [credentials],
            [priority]
        FROM @limit

        INSERT INTO [rule].rate (
            conditionId,
            targetCurrency,
            startAmount,
            startAmountCurrency,
            startAmountDaily,
            startCountDaily,
            startAmountWeekly,
            startCountWeekly,
            startAmountMonthly,
            startCountMonthly,
            rate
        )
        SELECT @conditionId,
            targetCurrency,
            startAmount,
            startAmountCurrency,
            startAmountDaily,
            startCountDaily,
            startAmountWeekly,
            startCountWeekly,
            startAmountMonthly,
            startCountMonthly,
            rate
        FROM @rate

        MERGE INTO [rule].splitName
        USING @split.nodes('/data/rows/splitName') AS records(r)
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (conditionId, name, tag) VALUES (@conditionId, r.value('(name)[1]', 'NVARCHAR(50)'), r.value('(tag)[1]', 'NVARCHAR(max)'))
        OUTPUT INSERTED.* INTO @splitName;

        MERGE INTO [rule].splitRange
        USING (
        SELECT
            sn.splitNameId AS splitNameId,
            splitRange.x.value('(startAmount)[1]', 'money') AS startAmount,
            splitRange.x.value('(startAmountCurrency)[1]', 'VARCHAR(3)') AS startAmountCurrency,
            ISNULL(splitRange.x.value('(./startAmountDaily/text())[1]', 'money'), 0) AS startAmountDaily,
            ISNULL(splitRange.x.value('(./startCountDaily/text())[1]', 'BIGINT'), 0) AS startCountDaily,
            ISNULL(splitRange.x.value('(./startAmountWeekly/text())[1]', 'money'), 0) AS startAmountWeekly,
            ISNULL(splitRange.x.value('(./startCountWeekly/text())[1]', 'BIGINT'), 0) AS startCountWeekly,
            ISNULL(splitRange.x.value('(./startAmountMonthly/text())[1]', 'money'), 0) AS startAmountMonthly,
            ISNULL(splitRange.x.value('(./startCountMonthly/text())[1]', 'BIGINT'), 0) AS startCountMonthly,
            ISNULL(splitRange.x.value('(isSourceAmount)[1]', 'BIT'), 1) AS isSourceAmount,
            splitRange.x.value('(minValue)[1]', 'money') AS minValue,
            splitRange.x.value('(maxValue)[1]', 'money') AS maxValue,
            splitRange.x.value('(percent)[1]', 'money') AS [percent],
            splitRange.x.value('(percentBase)[1]', 'money') AS percentBase
        FROM
            @split.nodes('/data/rows/splitRange') AS splitRange(x)
        JOIN
            @splitName sn
        ON
            splitRange.x.value('(../splitName/name)[1]', 'NVARCHAR(50)') = sn.name
        ) AS r
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (
            splitNameId,
            startAmount,
            startAmountCurrency,
            startAmountDaily,
            startCountDaily,
            startAmountWeekly,
            startCountWeekly,
            startAmountMonthly,
            startCountMonthly,
            isSourceAmount,
            minValue,
            maxValue,
            [percent],
            percentBase)
        VALUES (
            r.splitNameId,
            r.startAmount,
            r.startAmountCurrency,
            r.startAmountDaily,
            r.startCountDaily,
            r.startAmountWeekly,
            r.startCountWeekly,
            r.startAmountMonthly,
            r.startCountMonthly,
            r.isSourceAmount,
            r.minValue,
            r.maxValue,
            r.[percent],
            r.percentBase);

        MERGE INTO [rule].splitAssignment
        USING (
        SELECT
            sn.splitNameId AS splitNameId,
            splitAssignment.x.value('(debit)[1]', 'VARCHAR(50)') AS debit,
            splitAssignment.x.value('(credit)[1]', 'VARCHAR(50)') AS credit,
            splitAssignment.x.value('(minValue)[1]', 'money') AS minValue,
            splitAssignment.x.value('(maxValue)[1]', 'money') AS maxValue,
            splitAssignment.x.value('(percent)[1]', 'decimal') AS [percent],
            splitAssignment.x.value('(description)[1]', 'VARCHAR(50)') AS description
        FROM
            @split.nodes('/data/rows/splitAssignment') AS splitAssignment(x)
        JOIN
            @splitName sn
        ON
            splitAssignment.x.value('(../splitName/name)[1]', 'NVARCHAR(50)') = sn.name
        ) AS r
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description)
        VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description)
        OUTPUT INSERTED.* INTO @splitAssignment;


        MERGE INTO [rule].splitAnalytic
        USING (
        SELECT
            sn.splitAssignmentId AS splitAssignmentId,
            records.x.value('(name)[1]', 'NVARCHAR(50)') AS [name],
            records.x.value('(value)[1]', 'NVARCHAR(150)') AS [value]
        FROM
            @split.nodes('/data/rows/splitAssignment/splitAnalytic') records(x)
        JOIN
            @splitAssignment sn
        ON
            records.x.value('(../debit)[1]', 'NVARCHAR(50)') = sn.debit
            AND records.x.value('(../credit)[1]', 'NVARCHAR(50)') = sn.credit
            AND records.x.value('(../description)[1]', 'NVARCHAR(50)') = sn.[description]

        ) AS r (splitAssignmentId, [name], [value])
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (splitAssignmentId, [name], [value])
        VALUES (r.splitAssignmentId, r.[name], r.[value]);

    COMMIT TRANSACTION

    DECLARE @outcome XML = (
        SELECT
            @conditionId [key],
            c.priority rulePriority,
            GETUTCDATE() creationDateTime
        FROM
            @condition c
        FOR XML RAW
    )

    EXEC core.outcome @proc = @@PROCID, @outcome = @outcome, @meta = @meta

    EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
