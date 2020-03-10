ALTER PROCEDURE [rule].[rule.add]
    @condition [rule].conditionTT READONLY,
    @conditionActor [rule].conditionActorTT READONLY,
    @conditionItem [rule].conditionItemTT READONLY,
    @conditionProperty [rule].conditionPropertyTT READONLY,
    @limit [rule].limitTT READONLY,
    @split XML
AS
DECLARE
    @splitName [rule].splitNameTT,
    @splitAssignment [rule].splitAssignmentTT,
    @conditionId INT
BEGIN TRY

    IF EXISTS
        (
            SELECT [priority]
            FROM [rule].condition
            WHERE [priority] = (SELECT [priority] FROM @condition)
        )
        BEGIN
            RAISERROR ('rule.duplicatedPriority', 16, 1)
        END

    BEGIN TRANSACTION

        DECLARE @conditionIds TABLE (conditionId BIGINT);

        INSERT INTO [rule].condition (
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId
        )
        OUTPUT INSERTED.conditionId INTO @conditionIds
        SELECT
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId
        FROM @condition;

        SET @conditionId = (SELECT TOP 1 conditionId FROM @conditionIds ORDER BY conditionId DESC);

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
            maxCountMonthly
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
            [maxCountMonthly]
        FROM @limit

        INSERT INTO [rule].splitName (conditionId, name, tag)
        OUTPUT INSERTED.* INTO @splitName
        SELECT @conditionId, r.value('(name)[1]', 'nvarchar(50)'), r.value('(tag)[1]', 'nvarchar(max)')
        FROM @split.nodes('/data/rows/splitName') AS records(r);

        INSERT INTO [rule].splitRange (
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
        SELECT
            sn.splitNameId AS splitNameId,
            splitRange.x.value('(startAmount)[1]', 'money') AS startAmount,
            splitRange.x.value('(startAmountCurrency)[1]', 'varchar(3)') AS startAmountCurrency,
            ISNULL(splitRange.x.value('(./startAmountDaily/text())[1]', 'money'), 0) AS startAmountDaily,
            ISNULL(splitRange.x.value('(./startCountDaily/text())[1]', 'bigint'), 0) AS startCountDaily,
            ISNULL(splitRange.x.value('(./startAmountWeekly/text())[1]', 'money'), 0) AS startAmountWeekly,
            ISNULL(splitRange.x.value('(./startCountWeekly/text())[1]', 'bigint'), 0) AS startCountWeekly,
            ISNULL(splitRange.x.value('(./startAmountMonthly/text())[1]', 'money'), 0) AS startAmountMonthly,
            ISNULL(splitRange.x.value('(./startCountMonthly/text())[1]', 'bigint'), 0) AS startCountMonthly,
            ISNULL(splitRange.x.value('(isSourceAmount)[1]', 'bit'), 1) AS isSourceAmount,
            splitRange.x.value('(minValue)[1]', 'money') AS minValue,
            splitRange.x.value('(maxValue)[1]', 'money') AS maxValue,
            splitRange.x.value('(percent)[1]', 'money') AS [percent],
            splitRange.x.value('(percentBase)[1]', 'money') AS percentBase
        FROM
            @split.nodes('/data/rows/splitRange') AS splitRange(x)
        JOIN @splitName sn
            ON splitRange.x.value('(../splitName/name)[1]', 'nvarchar(50)') = sn.name;

        INSERT INTO [rule].splitAssignment (splitNameId, debit, credit, minValue, maxValue, [percent], description, debitTenantId, creditTenantId)
        OUTPUT INSERTED.splitNameId, INSERTED.debit, INSERTED.credit, INSERTED.minValue, INSERTED.maxValue, INSERTED.[percent], INSERTED.description, INSERTED.debitTenantId, INSERTED.creditTenantId
        INTO @splitAssignment(splitNameId, debit, credit, minValue, maxValue, [percent], description, debitTenantId, creditTenantId)
        SELECT
            sn.splitNameId AS splitNameId,
            splitAssignment.x.value('(debit)[1]', 'varchar(50)') AS debit,
            splitAssignment.x.value('(credit)[1]', 'varchar(50)') AS credit,
            splitAssignment.x.value('(minValue)[1]', 'money') AS minValue,
            splitAssignment.x.value('(maxValue)[1]', 'money') AS maxValue,
            splitAssignment.x.value('(percent)[1]', 'decimal') AS [percent],
            splitAssignment.x.value('(description)[1]', 'varchar(50)') AS description,
            splitAssignment.x.value('(debitTenantId)[1]', 'bigint') AS debitTenantId,
            splitAssignment.x.value('(creditTenantId)[1]', 'bigint') AS creditTenantId
        FROM
            @split.nodes('/data/rows/splitAssignment') AS splitAssignment(x)
        JOIN
            @splitName sn
        ON
            splitAssignment.x.value('(../splitName/name)[1]', 'nvarchar(50)') = sn.name;


        INSERT INTO [rule].splitAnalytic (splitAssignmentId, [name], [value])
        SELECT
            sn.splitAssignmentId AS splitAssignmentId,
            records.x.value('(name)[1]', 'nvarchar(50)') AS [name],
            records.x.value('(value)[1]', 'nvarchar(150)')	AS [value]
        FROM
            @split.nodes('/data/rows/splitAssignment/splitAnalytic') records(x)
        JOIN
            @splitAssignment sn
        ON
            records.x.value('(../debit)[1]', 'nvarchar(50)') = sn.debit
            AND records.x.value('(../credit)[1]', 'nvarchar(50)') = sn.credit
            AND records.x.value('(../description)[1]', 'nvarchar(50)') = sn.[description];

    COMMIT TRANSACTION

    EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
