ALTER PROCEDURE [rule].[rule.edit]
    @condition [rule].conditionTT READONLY,
    @conditionActor [rule].conditionActorTT READONLY,
    @conditionItem [rule].conditionItemTT READONLY,
    @conditionProperty [rule].conditionPropertyTT READONLY,
    @limit [rule].limitTT READONLY,
    @rate [rule].rateTT READONLY,
    @split XML,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
SET NOCOUNT ON
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @splitName TABLE (splitNameId INT, rowPosition INT)
DECLARE @splitAssignment [rule].splitAssignmentTT
DECLARE @splitAssignmentU [rule].splitAssignmentUnapprovedTT
DECLARE @conditionId INT = (SELECT conditionId FROM @condition)

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
            AND conditionId != @conditionId
        )
        BEGIN
            RAISERROR ('rule.duplicatedName', 16, 1)
        END

    SET @conditionId = (SELECT conditionId FROM @condition)

    BEGIN TRANSACTION
        DECLARE @DisableRuleMC TINYINT = (SELECT [value] FROM core.configuration WHERE [key] = 'DisableRuleM/C')
        IF @DisableRuleMC IS NOT NULL AND @DisableRuleMC = '0'
        BEGIN
            -- UPDATE c
            -- SET [priority] = c1.[priority],
            --     operationStartDate = c1.operationStartDate,
            --     operationEndDate = DATEADD(ms, -3, DATEADD(dd, 1, DATEADD(dd, DATEDIFF(dd, 0, c1.operationEndDate), 0))), -- the last time on this date - 23:59:59.997
            --     sourceAccountId = c1.sourceAccountId,
            --     destinationAccountId = c1.destinationAccountId,
            --     updatedOn = GETDATE(),
            --     updatedBy = @userId
            -- FROM [rule].conditionUnapproved c
            -- JOIN @condition c1 ON c.conditionId = c1.conditionId

            SET IDENTITY_INSERT [rule].[conditionUnapproved] ON -- allow conditionId to be inserted in the conditionunapproved table

            MERGE INTO [rule].conditionUnapproved cu
            USING @condition c
                ON cu.conditionId = c.conditionId
            WHEN MATCHED THEN
                UPDATE
                SET status = 'pending',
                    [priority] = c.priority,
                    operationStartDate = c.operationStartDate,
                    operationEndDate = c.operationEndDate,
                    sourceAccountId = c.sourceAccountId,
                    destinationAccountId = c.destinationAccountId,
                    name = c.name,
                    description = c.description,
                    notes = c.notes,
                    createdOn = c.createdOn,
                    createdBy = c.createdBy,
                    isEnabled = c.isEnabled
            WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, [priority], operationStartDate, operationEndDate, sourceAccountId,
            destinationAccountId, name, description, notes, createdOn, createdBy, status, isEnabled
            )
            VALUES (@conditionId, c.[priority], c.operationStartDate, c.operationEndDate, c.sourceAccountId,
            c.destinationAccountId, c.name, c.description, c.notes, c.createdOn, c.createdBy, 'pending', c.isEnabled
            );
            SET IDENTITY_INSERT [rule].[conditionUnapproved] OFF


            MERGE INTO [rule].conditionActorUnapproved ca
            USING @conditionActor ca1
                ON ca.conditionId = ca1.conditionId AND ca.factor = ca1.factor AND ca.actorId = ca1.actorId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, actorId)
                VALUES (@conditionId, ca1.factor, ca1.actorId)
            WHEN NOT MATCHED BY SOURCE AND ca.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].conditionItemUnapproved ci
            USING @conditionItem ci1
                ON ci.conditionId = ci1.conditionId AND ci.factor = ci1.factor AND ci.itemNameId = ci1.itemNameId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, itemNameId)
                VALUES (@conditionId, ci1.factor, ci1.itemNameId)
            WHEN NOT MATCHED BY SOURCE AND ci.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].conditionPropertyUnapproved cp
            USING @conditionProperty cp1
                ON cp.conditionId = cp1.conditionId AND cp.factor = cp1.factor AND cp.name = cp1.name
            WHEN MATCHED THEN
                UPDATE
                SET value = cp1.value
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, name, value, status)
                VALUES (@conditionId, cp1.factor, cp1.name, cp1.value, 'pending')
            WHEN NOT MATCHED BY SOURCE AND cp.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].limitUnapproved l
            USING @limit ll ON l.[limitId] = ll.limitId
            WHEN MATCHED THEN
                UPDATE
                SET currency = ll.currency,
                    minAmount = ll.minAmount,
                    maxAmount = ll.maxAmount,
                    maxAmountDaily = ll.maxAmountDaily,
                    maxCountDaily = ll.maxCountDaily,
                    maxAmountWeekly = ll.maxAmountWeekly,
                    maxCountWeekly = ll.maxCountWeekly,
                    maxAmountMonthly = ll.maxAmountMonthly,
                    maxCountMonthly = ll.maxCountMonthly,
                    [credentials] = ll.[credentials],
                    [priority] = ll.[priority]
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
                VALUES (@conditionId, ll.currency, ll.minAmount, ll.maxAmount, ll.maxAmountDaily, ll.maxCountDaily, ll.maxAmountWeekly, ll.maxCountWeekly, ll.maxAmountMonthly, ll.maxCountMonthly, ll.[credentials], ll.[priority])
            WHEN NOT MATCHED BY SOURCE AND l.conditionId = @conditionId THEN
                DELETE;

            DELETE x
            FROM [rule].splitRangeUnapproved x
            JOIN [rule].splitNameUnapproved sn ON x.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitRange/splitRangeId') AS records(x) ON x.splitRangeId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            DELETE x
            FROM [rule].splitAnalyticUnapproved x
            JOIN [rule].splitAssignmentUnapproved sa ON x.splitAssignmentId = sa.splitAssignmentId
            JOIN [rule].splitNameUnapproved sn ON sa.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitAssignment/splitAnalytic/splitAnalyticId') AS records(x) ON x.splitAnalyticId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            DELETE x
            FROM [rule].splitAssignmentUnapproved x
            JOIN [rule].splitNameUnapproved sn ON x.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitAssignment/splitAssignmentId') AS records(x) ON x.splitAssignmentId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            MERGE INTO [rule].splitNameUnapproved x
            USING
            (
                SELECT records.r.value('(./splitNameId)[1]', 'INT') AS splitNameId,
                    records.r.value('(./name/text())[1]', 'VARCHAR(50)') AS name,
                    records.r.value('(./tag/text())[1]', 'NVARCHAR(max)') AS tag,
                    records.r.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT') AS rowPos
                FROM @split.nodes('/data/rows/splitName') AS records(r)
            ) AS sn ON x.splitNameId = sn.splitNameId
            WHEN MATCHED THEN
            UPDATE
            SET name = sn.name,
                tag = sn.tag
            WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, name, tag)
            VALUES (@conditionId, sn.name, sn.tag)
            WHEN NOT MATCHED BY SOURCE AND x.conditionId = @conditionId THEN
                DELETE
            OUTPUT INSERTED.splitNameId, sn.rowPos INTO @splitName;

            MERGE INTO [rule].splitRangeUnapproved x
            USING
            (
            SELECT records.x.value('(./splitRangeId)[1]', 'INT') AS splitRangeId,
                sn.splitNameId AS splitNameId,
                records.x.value('(./startAmount/text())[1]', 'money') AS startAmount,
                records.x.value('(./startAmountCurrency/text())[1]', 'VARCHAR(3)') AS startAmountCurrency,
                ISNULL(records.x.value('(./startAmountDaily/text())[1]', 'money'), 0) AS startAmountDaily,
                ISNULL(records.x.value('(./startCountDaily/text())[1]', 'BIGINT'), 0) AS startCountDaily,
                ISNULL(records.x.value('(./startAmountWeekly/text())[1]', 'money'), 0) AS startAmountWeekly,
                ISNULL(records.x.value('(./startCountWeekly/text())[1]', 'BIGINT'), 0) AS startCountWeekly,
                ISNULL(records.x.value('(./startAmountMonthly/text())[1]', 'money'), 0) AS startAmountMonthly,
                ISNULL(records.x.value('(./startCountMonthly/text())[1]', 'BIGINT'), 0) AS startCountMonthly,
                ISNULL(records.x.value('(./isSourceAmount/text())[1]', 'BIT'), 1) AS isSourceAmount,
                records.x.value('(./minValue/text())[1]', 'money') AS minValue,
                records.x.value('(./maxValue/text())[1]', 'money') AS maxValue,
                records.x.value('(./percent/text())[1]', 'money') AS [percent],
                records.x.value('(./percentBase/text())[1]', 'money') AS percentBase,
                records.x.value('(./status/text())[1]', 'VARCHAR(20)') AS status
            FROM @split.nodes('/data/rows/splitRange') AS records(x)
            JOIN @splitName sn ON sn.rowPosition = records.x.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT')
            ) AS r ON x.splitRangeId = r.splitRangeId
            WHEN MATCHED THEN
                UPDATE
                SET startAmount = r.startAmount,
                    startAmountCurrency = r.startAmountCurrency,
                    startAmountDaily = r.startAmountDaily,
                    startCountDaily = r.startCountDaily,
                    startAmountWeekly = r.startAmountWeekly,
                    startCountWeekly = r.startCountWeekly,
                    startAmountMonthly = r.startAmountMonthly,
                    startCountMonthly = r.startCountMonthly,
                    isSourceAmount = r.isSourceAmount,
                    minValue = r.minValue,
                    maxValue = r.maxValue,
                    [percent] = r.[percent],
                    percentBase = r.percentBase,
                    status = r.status
            WHEN NOT MATCHED BY target THEN
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
                status)
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
                r.status);

            MERGE INTO [rule].splitAssignmentUnapproved x
            USING
            (
                SELECT records.x.value('(./splitAssignmentId)[1]', 'INT') AS splitAssignmentId,
                    sn.splitNameId AS splitNameId,
                    records.x.value('(./debit/text())[1]', 'VARCHAR(50)') AS debit,
                    records.x.value('(./credit/text())[1]', 'VARCHAR(50)') AS credit,
                    records.x.value('(./minValue/text())[1]', 'money') AS minValue,
                    records.x.value('(./maxValue/text())[1]', 'money') AS maxValue,
                    records.x.value('(./percent/text())[1]', 'money') AS [percent],
                    records.x.value('(./description/text())[1]', 'VARCHAR(50)') AS description,
                    records.x.value('(./status/text())[1]', 'VARCHAR(20)') AS status
                FROM @split.nodes('/data/rows/splitAssignment') AS records(x)
                JOIN @splitName sn ON sn.rowPosition = records.x.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT')
            ) AS r ON x.splitAssignmentId = r.splitAssignmentId
            WHEN MATCHED THEN
            UPDATE
            SET debit = r.debit,
                credit = r.credit,
                minValue = r.minValue,
                maxValue = r.maxValue,
                [percent] = r.[percent],
                description = r.description,
                status = r.status
            WHEN NOT MATCHED BY TARGET THEN
            INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description, status)
            VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description, r.status)
            OUTPUT INSERTED.* INTO @splitAssignmentU;

            MERGE INTO [rule].splitAnalyticUnapproved x
            USING (
            SELECT DISTINCT -- new splitAnalytic & new splitAssignment
                NULL AS [splitAnalyticId],
                sn.splitAssignmentId AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            LEFT JOIN @splitAssignmentU sn
                ON records.x.value('(debit)[1]', 'NVARCHAR(50)') = sn.debit
                    AND records.x.value('(credit)[1]', 'NVARCHAR(50)') = sn.credit
                    AND records.x.value('(description)[1]', 'NVARCHAR(50)') = sn.description
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) = 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) = 0
            UNION ALL
            SELECT DISTINCT -- new splitAnalytic & exist splitAssignment
                NULL AS [splitAnalyticId],
                records.x.value('(splitAssignmentId)[1]', 'BIGINT') AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) = 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) <> 0
            UNION ALL
            SELECT DISTINCT -- exist splitAnalytic & exist splitAssignment
                splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT') AS [splitAnalyticId],
                records.x.value('(splitAssignmentId)[1]', 'BIGINT') AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) <> 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) <> 0
            ) AS r ([splitAnalyticId], splitAssignmentId, [name], [value])
            ON x.splitAnalyticId = r.splitAnalyticId -- AND ISNULL(r.splitAnalyticId, 0) > 0
            WHEN MATCHED THEN
            UPDATE
            SET [splitAssignmentId] = r.[splitAssignmentId],
                [name] = r.[name],
                [value] = r.[value]
            WHEN NOT MATCHED THEN
            INSERT (splitAssignmentId, [name], [value])
            VALUES (r.splitAssignmentId, r.[name], r.[value])
            -- OUTPUT $action, DELETED.*, INSERTED.*
            ;
        END
        ELSE
        BEGIN -- default rule edit behavior
            UPDATE c
            SET [priority] = c1.[priority],
                operationStartDate = c1.operationStartDate,
                operationEndDate = DATEADD(ms, -3, DATEADD(dd, 1, DATEADD(dd, DATEDIFF(dd, 0, c1.operationEndDate), 0))), -- the last time on this date - 23:59:59.997
                sourceAccountId = c1.sourceAccountId,
                destinationAccountId = c1.destinationAccountId,
                name = c1.[name],
                description = c1.[description],
                notes = c1.notes,
                updatedOn = GETUTCDATE(),
                updatedBy = @userId
            FROM [rule].condition c
            JOIN @condition c1 ON c.conditionId = c1.conditionId

            MERGE INTO [rule].conditionActor ca
            USING @conditionActor ca1
                ON ca.conditionId = ca1.conditionId AND ca.factor = ca1.factor AND ca.actorId = ca1.actorId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, actorId)
                VALUES (@conditionId, ca1.factor, ca1.actorId)
            WHEN NOT MATCHED BY SOURCE AND ca.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].conditionItem ci
            USING @conditionItem ci1
                ON ci.conditionId = ci1.conditionId AND ci.factor = ci1.factor AND ci.itemNameId = ci1.itemNameId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, itemNameId)
                VALUES (@conditionId, ci1.factor, ci1.itemNameId)
            WHEN NOT MATCHED BY SOURCE AND ci.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].conditionProperty cp
            USING @conditionProperty cp1
                ON cp.conditionId = cp1.conditionId AND cp.factor = cp1.factor AND cp.name = cp1.name
            WHEN MATCHED THEN
                UPDATE
                SET value = cp1.value
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, name, value)
                VALUES (@conditionId, cp1.factor, cp1.name, cp1.value)
            WHEN NOT MATCHED BY SOURCE AND cp.conditionId = @conditionId THEN
                DELETE;

            MERGE INTO [rule].limit l
            USING @limit l1 ON l.[limitId] = l1.limitId
            WHEN MATCHED THEN
                UPDATE
                SET currency = l1.currency,
                    minAmount = l1.minAmount,
                    maxAmount = l1.maxAmount,
                    maxAmountDaily = l1.maxAmountDaily,
                    maxCountDaily = l1.maxCountDaily,
                    maxAmountWeekly = l1.maxAmountWeekly,
                    maxCountWeekly = l1.maxCountWeekly,
                    maxAmountMonthly = l1.maxAmountMonthly,
                    maxCountMonthly = l1.maxCountMonthly,
                    [credentials] = l1.[credentials],
                    [priority] = l1.[priority]
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
                VALUES (@conditionId, l1.currency, l1.minAmount, l1.maxAmount, l1.maxAmountDaily, l1.maxCountDaily, l1.maxAmountWeekly, l1.maxCountWeekly, l1.maxAmountMonthly, l1.maxCountMonthly, l1.[credentials], l1.[priority])
            WHEN NOT MATCHED BY SOURCE AND l.conditionId = @conditionId THEN
                DELETE;

            DELETE x
            FROM [rule].splitRange x
            JOIN [rule].splitName sn ON x.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitRange/splitRangeId') AS records(x) ON x.splitRangeId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            DELETE x
            FROM [rule].splitAnalytic x
            JOIN [rule].splitAssignment sa ON x.splitAssignmentId = sa.splitAssignmentId
            JOIN [rule].splitName sn ON sa.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitAssignment/splitAnalytic/splitAnalyticId') AS records(x) ON x.splitAnalyticId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            DELETE x
            FROM [rule].splitAssignment x
            JOIN [rule].splitName sn ON x.splitNameId = sn.splitNameId
            LEFT JOIN @split.nodes('/data/rows/splitAssignment/splitAssignmentId') AS records(x) ON x.splitAssignmentId = records.x.value('(./text())[1]', 'INT')
            WHERE sn.conditionId = @conditionId AND records.x.value('(./text())[1]', 'INT') IS NULL

            MERGE INTO [rule].splitName x
            USING
            (
                SELECT records.r.value('(./splitNameId)[1]', 'INT') AS splitNameId,
                    records.r.value('(./name/text())[1]', 'VARCHAR(50)') AS name,
                    records.r.value('(./tag/text())[1]', 'NVARCHAR(max)') AS tag,
                    records.r.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT') AS rowPos
                FROM @split.nodes('/data/rows/splitName') AS records(r)
            ) AS sn ON x.splitNameId = sn.splitNameId
            WHEN MATCHED THEN
            UPDATE
            SET name = sn.name,
                tag = sn.tag
            WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, name, tag)
            VALUES (@conditionId, sn.name, sn.tag)
            WHEN NOT MATCHED BY SOURCE AND x.conditionId = @conditionId THEN
                DELETE
            OUTPUT INSERTED.splitNameId, sn.rowPos INTO @splitName;

            MERGE INTO [rule].splitRange x
            USING
            (
            SELECT records.x.value('(./splitRangeId)[1]', 'INT') AS splitRangeId,
                sn.splitNameId AS splitNameId,
                records.x.value('(./startAmount/text())[1]', 'money') AS startAmount,
                records.x.value('(./startAmountCurrency/text())[1]', 'VARCHAR(3)') AS startAmountCurrency,
                ISNULL(records.x.value('(./startAmountDaily/text())[1]', 'money'), 0) AS startAmountDaily,
                ISNULL(records.x.value('(./startCountDaily/text())[1]', 'BIGINT'), 0) AS startCountDaily,
                ISNULL(records.x.value('(./startAmountWeekly/text())[1]', 'money'), 0) AS startAmountWeekly,
                ISNULL(records.x.value('(./startCountWeekly/text())[1]', 'BIGINT'), 0) AS startCountWeekly,
                ISNULL(records.x.value('(./startAmountMonthly/text())[1]', 'money'), 0) AS startAmountMonthly,
                ISNULL(records.x.value('(./startCountMonthly/text())[1]', 'BIGINT'), 0) AS startCountMonthly,
                ISNULL(records.x.value('(./isSourceAmount/text())[1]', 'BIT'), 1) AS isSourceAmount,
                records.x.value('(./minValue/text())[1]', 'money') AS minValue,
                records.x.value('(./maxValue/text())[1]', 'money') AS maxValue,
                records.x.value('(./percent/text())[1]', 'money') AS [percent],
                records.x.value('(./percentBase/text())[1]', 'money') AS percentBase
            FROM @split.nodes('/data/rows/splitRange') AS records(x)
            JOIN @splitName sn ON sn.rowPosition = records.x.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT')
            ) AS r ON x.splitRangeId = r.splitRangeId
            WHEN MATCHED THEN
                UPDATE
                SET startAmount = r.startAmount,
                    startAmountCurrency = r.startAmountCurrency,
                    startAmountDaily = r.startAmountDaily,
                    startCountDaily = r.startCountDaily,
                    startAmountWeekly = r.startAmountWeekly,
                    startCountWeekly = r.startCountWeekly,
                    startAmountMonthly = r.startAmountMonthly,
                    startCountMonthly = r.startCountMonthly,
                    isSourceAmount = r.isSourceAmount,
                    minValue = r.minValue,
                    maxValue = r.maxValue,
                    [percent] = r.[percent],
                    percentBase = r.percentBase
            WHEN NOT MATCHED BY target THEN
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

            MERGE INTO [rule].splitAssignment x
            USING
            (
                SELECT records.x.value('(./splitAssignmentId)[1]', 'INT') AS splitAssignmentId,
                    sn.splitNameId AS splitNameId,
                    records.x.value('(./debit/text())[1]', 'VARCHAR(50)') AS debit,
                    records.x.value('(./credit/text())[1]', 'VARCHAR(50)') AS credit,
                    records.x.value('(./minValue/text())[1]', 'money') AS minValue,
                    records.x.value('(./maxValue/text())[1]', 'money') AS maxValue,
                    records.x.value('(./percent/text())[1]', 'decimal') AS [percent],
                    records.x.value('(./description/text())[1]', 'VARCHAR(50)') AS description
                FROM @split.nodes('/data/rows/splitAssignment') AS records(x)
                JOIN @splitName sn ON sn.rowPosition = records.x.value('for $a in .. return 1 + count($a/../*[.[(local-name()="rows")] << $a])', 'INT')
            ) AS r ON x.splitAssignmentId = r.splitAssignmentId
            WHEN MATCHED THEN
            UPDATE
            SET debit = r.debit,
                credit = r.credit,
                minValue = r.minValue,
                maxValue = r.maxValue,
                [percent] = r.[percent],
                description = r.description
            WHEN NOT MATCHED BY TARGET THEN
            INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], description)
            VALUES (r.splitNameId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description)
            OUTPUT INSERTED.* INTO @splitAssignment;

            MERGE INTO [rule].splitAnalytic x
            USING (
            SELECT DISTINCT -- new splitAnalytic & new splitAssignment
                NULL AS [splitAnalyticId],
                sn.splitAssignmentId AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            LEFT JOIN @splitAssignment sn
                ON records.x.value('(debit)[1]', 'NVARCHAR(50)') = sn.debit
                    AND records.x.value('(credit)[1]', 'NVARCHAR(50)') = sn.credit
                    AND records.x.value('(description)[1]', 'NVARCHAR(50)') = sn.description
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) = 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) = 0
            UNION ALL
            SELECT DISTINCT -- new splitAnalytic & exist splitAssignment
                NULL AS [splitAnalyticId],
                records.x.value('(splitAssignmentId)[1]', 'BIGINT') AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) = 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) <> 0
            UNION ALL
            SELECT DISTINCT -- exist splitAnalytic & exist splitAssignment
                splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT') AS [splitAnalyticId],
                records.x.value('(splitAssignmentId)[1]', 'BIGINT') AS [splitAssignmentId],
                splitAssignment.x.query('*').value('(name)[1]', 'NVARCHAR(50)') AS [name],
                splitAssignment.x.query('*').value('(value)[1]', 'NVARCHAR(150)') AS [value]
            FROM
                @split.nodes('/data/rows/splitAssignment') AS records(x)
            CROSS APPLY
                records.x.nodes('splitAnalytic') AS splitAssignment(x)
            WHERE ISNULL(splitAssignment.x.query('*').value('(splitAnalyticId)[1]', 'BIGINT'), 0) <> 0
            AND ISNULL(records.x.value('(splitAssignmentId)[1]', 'BIGINT'), 0) <> 0
            ) AS r ([splitAnalyticId], splitAssignmentId, [name], [value])
            ON x.splitAnalyticId = r.splitAnalyticId -- AND ISNULL(r.splitAnalyticId, 0) > 0
            WHEN MATCHED THEN
            UPDATE
            SET [splitAssignmentId] = r.[splitAssignmentId],
                [name] = r.[name],
                [value] = r.[value]
            WHEN NOT MATCHED THEN
            INSERT (splitAssignmentId, [name], [value])
            VALUES (r.splitAssignmentId, r.[name], r.[value])
            -- OUTPUT $action, DELETED.*, INSERTED.*
            ;
        END

    COMMIT TRANSACTION

    DECLARE @outcome XML = (
        SELECT
            @conditionId [key],
            c.priority rulePriority,
            GETUTCDATE() editDateTime
        FROM @condition c
        FOR XML RAW
    )

    EXEC core.outcome @proc = @@PROCID, @outcome = @outcome, @meta = @meta

    -- EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION

    EXEC core.error
    RETURN 55555
END CATCH
