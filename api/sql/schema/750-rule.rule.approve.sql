ALTER PROCEDURE [rule].[rule.approve]
    @conditionId INT,
    @meta core.metaDataTT READONLY -- information for the logged user
AS

BEGIN TRY
    DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
    -- checks if the user has a right to get user
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF NOT EXISTS(
        SELECT 1
        FROM [rule].[condition] c
        WHERE c.conditionId = @conditionId
    )
    AND NOT EXISTS(
        SELECT 1
        FROM [rule].[conditionUnapproved] c
        WHERE c.conditionId = @conditionId
    )
    BEGIN
        RAISERROR ('rule.ruleNotExists', 16, 1)
    END

    DECLARE @result INT;

    SELECT
        @result = CASE
        WHEN EXISTS (
            SELECT 1
            FROM [rule].[conditionUnapproved]
            WHERE conditionId = @conditionId AND isEnabled = 1
        )
        AND EXISTS (
            SELECT 1
            FROM [rule].[condition]
            WHERE conditionId = @conditionId AND isEnabled = 0
        ) THEN 1 -- Both conditions are true
        ELSE 0 -- At least one condition is false
        END;

    BEGIN TRANSACTION

        IF EXISTS(SELECT 1 FROM [rule].[conditionUnapproved] WHERE conditionId = @conditionId AND isEnabled = 0)
            BEGIN
                UPDATE c
                SET isEnabled = 0,
                updatedBy = @userId,
                updatedOn = SYSDATETIME()
                FROM [rule].condition c
                WHERE c.conditionId = @conditionId
                DELETE FROM [rule].conditionUnapproved WHERE conditionId = @conditionId
            END
        ELSE IF @result = 1
        BEGIN
            UPDATE c
                SET isEnabled = 1,
                updatedBy = @userId,
                updatedOn = SYSDATETIME()
                FROM [rule].condition c
                WHERE c.conditionId = @conditionId
                DELETE FROM [rule].conditionUnapproved WHERE conditionId = @conditionId
            END
        ELSE
        BEGIN
            -- handle condition
            IF EXISTS(SELECT 1 FROM [rule].[conditionUnapproved] WHERE conditionId = @conditionId AND isDeleted = 1)
                BEGIN
                    DECLARE @conditionRemoveIds core.arrayList
                    INSERT INTO @conditionRemoveIds
                    SELECT @conditionId
                    EXEC [rule].[rule.delete] @conditionId = @conditionRemoveIds, @meta = @meta

                    UPDATE x
                    SET isDeleted = 1,
                    isEnabled = 0,
                    updatedOn = GETUTCDATE(),
                    updatedBy = @userId,
                    [status] = 'Deleted'
                    FROM [rule].condition x WHERE x.conditionId = @conditionId
                END
            ELSE
            BEGIN
                IF EXISTS(SELECT 1 FROM [rule].[condition] WHERE conditionId = @conditionId)
                    BEGIN
                        UPDATE c
                        SET
                            c.updatedBy = @userId,
                            c.updatedOn = GETDATE(),
                            c.status = 'approved',
                            c.operationStartDate = cu.operationStartDate,
                            c.operationEndDate = cu.operationEndDate,
                            c.sourceAccountId = cu.sourceAccountId,
                            c.name = cu.name,
                            c.description = cu.description,
                            c.notes = cu.notes,
                            c.priority = cu.priority,
                            c.isEnabled = cu.isEnabled
                        FROM [rule].[condition] c
                        INNER JOIN [rule].[conditionUnapproved] cu ON cu.conditionId = c.conditionId
                        WHERE c.conditionId = @conditionId
                    END
                ELSE
                    BEGIN
                        SET IDENTITY_INSERT [rule].[condition] ON -- allow conditionId to be inserted in the condition table
                        INSERT INTO [rule].[condition] (conditionId, priority, status, operationStartDate, operationEndDate, sourceAccountId, name, description, notes, isDeleted, createdBy, updatedBy, isEnabled)
                        SELECT cu.conditionId, cu.priority, 'approved', cu.operationStartDate, cu.operationEndDate, cu.sourceAccountId, cu.name, cu.description, cu.notes, 0, cu.createdBy, cu.updatedBy, 1
                        FROM [rule].[conditionUnapproved] cu
                        WHERE cu.conditionId = @conditionId
                        SET IDENTITY_INSERT [rule].[condition] OFF
                    END
            END

            -- handle condition actor
            MERGE [rule].[conditionActor] AS TARGET
            USING (
                SELECT * FROM [rule].[conditionActorUnapproved] WHERE conditionId = @conditionId
            ) AS SOURCE
            ON TARGET.conditionId = SOURCE.conditionId AND TARGET.factor = SOURCE.factor AND TARGET.actorId = SOURCE.actorId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, actorId)
                VALUES(SOURCE.conditionId, SOURCE.factor, SOURCE.actorId)
            WHEN NOT MATCHED BY SOURCE AND TARGET.conditionId = @conditionId THEN DELETE;

            -- handle condition item
            MERGE [rule].[conditionItem] AS TARGET
            USING (
                SELECT * FROM [rule].[conditionItemUnapproved] WHERE conditionId = @conditionId
            ) AS SOURCE
            ON TARGET.conditionId = SOURCE.conditionId AND TARGET.factor = SOURCE.factor AND TARGET.itemNameId = SOURCE.itemNameId
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, itemNameId)
                VALUES(SOURCE.conditionId, SOURCE.factor, SOURCE.itemNameId)
            WHEN NOT MATCHED BY SOURCE AND TARGET.conditionId = @conditionId THEN DELETE;

            -- handle condition property
            MERGE [rule].[conditionProperty] AS TARGET
            USING (
                SELECT * FROM [rule].[conditionPropertyUnapproved] WHERE conditionId = @conditionId
            ) AS SOURCE
            ON TARGET.conditionId = SOURCE.conditionId AND TARGET.factor = SOURCE.factor
            WHEN MATCHED THEN UPDATE SET
                TARGET.name = SOURCE.name,
                TARGET.value = SOURCE.value
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (conditionId, factor, name, value)
                VALUES(SOURCE.conditionId, SOURCE.factor, SOURCE.name, SOURCE.value)
            WHEN NOT MATCHED BY SOURCE AND TARGET.conditionId = @conditionId THEN DELETE;


            -- handle limit
            IF EXISTS(SELECT 1 FROM [rule].[limit] WHERE conditionId = @conditionId)
                BEGIN
                    UPDATE ca
                    SET
                        ca.currency = cau.currency,
                        ca.minAmount = cau.minAmount,
                        ca.maxAmount = cau.maxAmount,
                        ca.maxAmountDaily = cau.maxAmountDaily,
                        ca.maxCountDaily = cau.maxCountDaily,
                        ca.maxAmountWeekly = cau.maxAmountWeekly,
                        ca.maxCountWeekly = cau.maxCountWeekly,
                        ca.maxAmountMonthly = cau.maxAmountMonthly,
                        ca.maxCountMonthly = cau.maxCountMonthly,
                        ca.credentials = cau.credentials,
                        ca.priority = cau.priority--,
                        --ca.status = 'approved'
                    FROM [rule].limit ca
                    INNER JOIN [rule].[limitUnapproved] cau ON cau.conditionId = ca.conditionId
                    WHERE ca.conditionId = @conditionId
                END
            ELSE
                BEGIN
                    SET IDENTITY_INSERT [rule].[limit] ON -- allow limitId to be inserted in the limit table
                    INSERT INTO [rule].[limit] (limitId, conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
                    SELECT
                        cai.limitId,
                        cai.conditionId,
                        cai.currency,
                        cai.minAmount,
                        cai.maxAmount,
                        cai.maxAmountDaily,
                        cai.maxCountDaily,
                        cai.maxAmountWeekly,
                        cai.maxCountWeekly,
                        cai.maxAmountMonthly,
                        cai.maxCountMonthly,
                        cai.credentials,
                        cai.priority
                    FROM [rule].[limitUnapproved] cai
                    WHERE cai.conditionId = @conditionId
                    SET IDENTITY_INSERT [rule].[limit] OFF
                END

            DELETE
                x
            FROM
                [rule].splitRange x
            JOIN
                [rule].splitName s ON s.splitNameId = x.splitNameId
            WHERE s.conditionId = @conditionId

            DELETE
                x
            FROM
                [rule].splitAnalytic x
            JOIN
                [rule].splitAssignment y ON y.splitAssignmentId = x.splitAssignmentId
            JOIN
                [rule].splitName s ON s.splitNameId = y.splitNameId
            WHERE s.conditionId = @conditionId


            DELETE
                x
            FROM
                [rule].splitAssignment x
            JOIN
                [rule].splitName s ON s.splitNameId = x.splitNameId
            WHERE s.conditionId = @conditionId

            DELETE
                x
            FROM
                [rule].splitName x
            WHERE x.conditionId = @conditionId


            -- handle split analytic
            SET IDENTITY_INSERT [rule].[splitAnalytic] ON -- allow splitAnalyticId to be inserted in the split analytic table
            INSERT INTO [rule].[splitAnalytic] (splitAnalyticId, splitAssignmentId, name, value)
            SELECT spau.splitAnalyticId, spau.splitAssignmentId, spau.name, spau.value
            FROM [rule].[splitAnalyticUnapproved] spau
            JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = spau.splitAssignmentId
            JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sn.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitAnalytic] OFF

            -- handle split name
            SET IDENTITY_INSERT [rule].[splitName] ON -- allow split name to be inserted in the split name table
            INSERT INTO [rule].[splitName] (splitNameId, conditionId, [name], tag)
            SELECT snu.splitNameId, snu.conditionId, snu.name, snu.tag
            FROM [rule].[splitNameUnapproved] snu
            WHERE snu.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitName] OFF


            -- handle split range
            SET IDENTITY_INSERT [rule].[splitRange] ON --allow split range id to be inserted
            INSERT INTO [rule].[splitRange] ( splitRangeId, startAmount, startAmountCurrency, startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly, isSourceAmount, minValue, maxValue, [percent], percentBase, splitNameId)
            SELECT
                sr.splitRangeId,
                sr.startAmount,
                sr.startAmountCurrency,
                sr.startAmountDaily,
                sr.startCountDaily,
                sr.startAmountWeekly,
                sr.startCountWeekly,
                sr.startAmountMonthly,
                sr.startCountMonthly,
                sr.isSourceAmount,
                sr.minValue,
                sr.maxValue,
                sr.[percent],
                sr.percentBase,
                sr.splitNameId
            FROM [rule].[splitRangeUnapproved] sr
            INNER JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sr.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitRange] OFF

            -- handle split assignment
            SET IDENTITY_INSERT [rule].[splitAssignment] ON -- allow splitAssignment to be inserted in the split assignment table
            INSERT INTO [rule].[splitAssignment] (splitAssignmentId, splitNameId, debit, credit, minValue, maxValue, [percent], description)
            SELECT sa.splitAssignmentId, sa.splitNameId, sa.debit, sa.credit, sa.minValue, sa.maxValue, sa.[percent], sa.description
            FROM [rule].[splitAssignmentUnapproved] sa
            JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sa.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitAssignment] OFF

            DECLARE @conditionIds core.arrayList
            INSERT INTO @conditionIds
            SELECT @conditionId
            EXEC [rule].[rule.deleteUnapproved] @conditionId = @conditionIds, @meta = @meta
        END

    COMMIT TRANSACTION

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
