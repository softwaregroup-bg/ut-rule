ALTER PROCEDURE [rule].[rule.addUnapproved]
    @condition [rule].conditionUnapprovedTT READONLY,
    @conditionActor [rule].conditionActorUnapprovedTT READONLY,
    @conditionItem [rule].conditionItemUnapprovedTT READONLY,
    @conditionProperty [rule].conditionPropertyUnapprovedTT READONLY,
    @limit [rule].limitUnapprovedTT READONLY,
    @split XML,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @splitName [rule].splitNameUnapprovedTT,
    @splitAssignment [rule].splitAssignmentUnapprovedTT,
    @conditionId INT
BEGIN TRY

    IF EXISTS
        (
            SELECT [name]
            FROM [rule].condition
            WHERE [name] = (SELECT [name] FROM @condition)
        )
        OR
        EXISTS
        (
            SELECT [name]
            FROM [rule].conditionUnapproved
            WHERE [name] = (SELECT [name] FROM @condition)
        )
        BEGIN
            RAISERROR ('rule.duplicatedName', 16, 1)
        END

    -- IF EXISTS
    -- (
    --     SELECT [priority]
    --     FROM [rule].condition
    --     WHERE [priority] = (SELECT [priority] FROM @condition)
    --         AND isDeleted = 0
    -- )
    -- OR
    -- EXISTS
    -- (
    --     SELECT [priority]
    --     FROM [rule].conditionUnapproved
    --     WHERE [priority] = (SELECT [priority] FROM @condition)
    -- )
    -- BEGIN
    --     RAISERROR ('rule.duplicatedPriority', 16, 1)
    -- END

    BEGIN TRANSACTION

        INSERT INTO [rule].conditionUnapproved(
            [priority],
            operationStartDate,
            operationEndDate,
            sourceAccountId,
            destinationAccountId,
            [name],
            [description],
            notes,
            createdOn,
            createdBy,
            [status],
            isEnabled
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
            GETDATE(),
            ISNULL(createdBy, @userId),
            'new',
            1
        FROM @condition;

        SET @conditionId = SCOPE_IDENTITY()

        INSERT INTO [rule].conditionActorUnapproved
        (
            conditionId,
            factor,
            actorId,
            [status]
        )
        SELECT
            @conditionId,
            factor,
            actorId,
            'new'
        FROM @conditionActor

        INSERT INTO [rule].conditionItemUnapproved
        (
            conditionId,
            factor,
            itemNameId,
            [status]
        )
        SELECT
            @conditionId,
            factor,
            itemNameId,
            'new'
        FROM @conditionItem

        INSERT INTO [rule].conditionPropertyUnapproved
        (
            conditionId,
            factor,
            name,
            value,
            [status]
        )
        SELECT
            @conditionId,
            factor,
            name,
            value,
            'new'
        FROM @conditionProperty

        IF EXISTS (SELECT TOP 1 1 FROM @limit)
        BEGIN
            INSERT INTO [rule].limitUnapproved(
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
                [priority],
                [status]
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
                [priority],
                'new'
            FROM @limit
        END
        MERGE INTO [rule].splitNameUnapproved
        USING @split.nodes('/data/rows/splitName') AS records(r)
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (conditionId, name, tag, [status]) VALUES (@conditionId, r.value('(name)[1]', 'NVARCHAR(50)'), r.value('(tag)[1]', 'NVARCHAR(max)'), 'new')
        OUTPUT
            INSERTED.splitNameId,
            INSERTED.conditionId,
            INSERTED.name,
            INSERTED.tag,
            INSERTED.amountType,
            INSERTED.status
        INTO
            @splitName(
            splitNameId,
            conditionId,
            name,
            tag,
            amountType,
            [status]
            );

        MERGE INTO [rule].splitRangeUnapproved
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
            splitRange.x.value('(percentBase)[1]', 'money') AS percentBase,
            'new' AS status
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
            percentBase,
            [status])
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
            r.percentBase,
            'new');

        MERGE INTO [rule].splitAssignmentUnapproved
        USING (
        SELECT
            sn.splitNameId AS splitNameId,
            splitAssignment.x.value('(debit)[1]', 'VARCHAR(50)') AS debit,
            splitAssignment.x.value('(credit)[1]', 'VARCHAR(50)') AS credit,
            splitAssignment.x.value('(minValue)[1]', 'money') AS minValue,
            splitAssignment.x.value('(maxValue)[1]', 'money') AS maxValue,
            splitAssignment.x.value('(percent)[1]', 'money') AS [percent],
            splitAssignment.x.value('(description)[1]', 'VARCHAR(50)') AS description,
            'new' AS [status]
        FROM
            @split.nodes('/data/rows/splitAssignment') AS splitAssignment(x)
        JOIN
            @splitName sn
        ON
            splitAssignment.x.value('(../splitName/name)[1]', 'NVARCHAR(50)') = sn.name
        ) AS r
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description, status)
        VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description, 'new')
        OUTPUT INSERTED.* INTO @splitAssignment;


        MERGE INTO [rule].splitAnalyticUnapproved
        USING (
        SELECT
            sn.splitAssignmentId AS splitAssignmentId,
            records.x.value('(name)[1]', 'NVARCHAR(50)') AS [name],
            records.x.value('(value)[1]', 'NVARCHAR(150)') AS [value],
            'new' AS [status]
        FROM
            @split.nodes('/data/rows/splitAssignment/splitAnalytic') records(x)
        JOIN
            @splitAssignment sn
        ON
            records.x.value('(../debit)[1]', 'NVARCHAR(50)') = sn.debit
            AND records.x.value('(../credit)[1]', 'NVARCHAR(50)') = sn.credit
            AND records.x.value('(../description)[1]', 'NVARCHAR(50)') = sn.[description]

        ) AS r (splitAssignmentId, [name], [value], [status])
        ON 1 = 0
        WHEN NOT MATCHED THEN
        INSERT (splitAssignmentId, [name], [value], [status])
        VALUES (r.splitAssignmentId, r.[name], r.[value], 'new');

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

    -- EXEC [rule].[rule.fetch] @meta = @meta, @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
