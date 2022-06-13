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
        WHERE c.conditionId = @conditionId)
        AND
        NOT EXISTS(
        SELECT 1
        FROM [rule].[conditionUnapproved] c
        WHERE c.conditionId = @conditionId)
        BEGIN
            RAISERROR ('rule.ruleNotExists', 16, 1)
        END

    BEGIN TRANSACTION

    -- handle condition
        IF EXISTS(SELECT 1 FROM [rule].[conditionUnapproved] WHERE conditionId = @conditionId AND isDeleted = 1)
        BEGIN
            DECLARE @conditionRemoveIds core.arrayList
            INSERT INTO @conditionRemoveIds
            SELECT @conditionId
            EXEC [rule].[rule.remove] @conditionId = @conditionRemoveIds
        END
    ELSE
        BEGIN
            IF EXISTS(SELECT 1 FROM [rule].[condition] WHERE conditionId = @conditionId)
                BEGIN
                    UPDATE c
                    SET
                        c.updatedBy = cu.updatedBy,
                        c.updatedOn = cu.updatedOn,
                        c.status = 'approved',
                        c.operationStartDate = cu.operationStartDate,
                        c.operationEndDate = cu.operationEndDate,
                        c.sourceAccountId = cu.sourceAccountId,
                        c.priority = cu.priority,
                        c.isEnabled = cu.isEnabled
                    FROM [rule].[condition] c
                    INNER JOIN [rule].[conditionUnapproved] cu ON cu.conditionId = c.conditionId
                    WHERE c.conditionId = @conditionId
                END
            ELSE
                BEGIN
                    SET IDENTITY_INSERT [rule].[condition] ON -- allow conditionId to be inserted in the condition table
                    INSERT INTO [rule].[condition] (conditionId, priority, status, operationStartDate, operationEndDate, sourceAccountId, isDeleted, createdBy, updatedBy, isEnabled)
                    SELECT cu.conditionId, cu.priority, 'approved', cu.operationStartDate, cu.operationEndDate, cu.sourceAccountId, 0, cu.createdBy, cu.updatedBy, cu.isEnabled
                    FROM [rule].[conditionUnapproved] cu
                    WHERE cu.conditionId = @conditionId
                    SET IDENTITY_INSERT [rule].[condition] OFF
                END
        END



    -- handle condition actor
    IF EXISTS(SELECT 1 FROM [rule].[conditionActor] WHERE conditionId = @conditionId)
        BEGIN
            UPDATE ca
            SET
                ca.factor = cau.factor,
                ca.actorId = cau.actorId,
                ca.status = 'approved'
            FROM [rule].[conditionActor] ca
            INNER JOIN [rule].[conditionActorUnapproved] cau ON cau.conditionId = ca.conditionId
            WHERE ca.conditionId = @conditionId
        END
    ELSE
        BEGIN
            INSERT INTO [rule].[conditionActor] (conditionId, factor, actorId, status)
            SELECT cau.conditionId, cau.factor, cau.actorId, 'approved'
            FROM [rule].[conditionActorUnapproved] cau
            WHERE cau.conditionId = @conditionId
        END



    -- handle condition item
    IF EXISTS(SELECT 1 FROM [rule].[conditionItem] WHERE conditionId = @conditionId)
        BEGIN
            UPDATE ca
            SET
                ca.factor = cau.factor,
                ca.itemNameId = cau.itemNameId,
                ca.status = 'approved'
            FROM [rule].[conditionItem] ca
            INNER JOIN [rule].[conditionItemUnapproved] cau ON cau.conditionId = ca.conditionId
            WHERE ca.conditionId = @conditionId
        END
    ELSE
        BEGIN
            INSERT INTO [rule].[conditionItem] (conditionId, factor, itemNameId, status)
            SELECT ciu.conditionId, ciu.factor, ciu.itemNameId, 'approved'
            FROM [rule].[conditionItemUnapproved] ciu
            WHERE ciu.conditionId = @conditionId
        END



    -- handle condition property
    IF EXISTS(SELECT 1 FROM [rule].[conditionProperty] WHERE conditionId = @conditionId)
        BEGIN
            UPDATE ca
            SET
                ca.factor = cau.factor,
                ca.name = cau.name,
                ca.value = cau.value,
                ca.status = 'approved'
            FROM [rule].[conditionProperty] ca
            INNER JOIN [rule].[conditionPropertyUnapproved] cau ON cau.conditionId = ca.conditionId
            WHERE ca.conditionId = @conditionId
        END
    ELSE
        BEGIN
            INSERT INTO [rule].[conditionProperty] (conditionId, factor, name, value, status)
            SELECT cai.conditionId, cai.factor, cai.name, cai.value, 'approved'
            FROM [rule].[conditionPropertyUnapproved] cai
            WHERE cai.conditionId = @conditionId
        END



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
                ca.priority = cau.priority,
                ca.status = 'approved'
            FROM [rule].limit ca
            INNER JOIN [rule].[limitUnapproved] cau ON cau.conditionId = ca.conditionId
            WHERE ca.conditionId = @conditionId
        END
    ELSE
        BEGIN
            SET IDENTITY_INSERT [rule].[limit] ON -- allow limitId to be inserted in the limit table
            INSERT INTO [rule].[limit] (limitId, conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority], status)
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
                cai.priority,
                'approved'
            FROM [rule].[limitUnapproved] cai
            WHERE cai.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[limit] OFF
        END



    -- handle split analytic
    IF EXISTS(
        SELECT 1 FROM [rule].[splitAnalytic] sa
        JOIN [rule].[splitAssignment] sp ON sp.splitAssignmentId = sa.splitAssignmentId
        JOIN [rule].[splitName] sn ON sp.splitNameId = sn.splitNameId
        WHERE sn.conditionId = @conditionId
    )
        BEGIN
            UPDATE spa
            SET
                spa.name = spau.name,
                spa.value = spau.value,
                spa.status = 'approved'
            FROM [rule].[splitAnalytic] spa
            INNER JOIN [rule].[splitAnalyticUnapproved] spau ON spau.splitAnalyticId = spa.splitAnalyticId
            INNER JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = spau.splitAssignmentId
            INNER JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sp.splitNameId
            WHERE sn.conditionId = @conditionId
        END
    ELSE
        BEGIN
            SET IDENTITY_INSERT [rule].[splitAnalytic] ON -- allow splitAnalyticId to be inserted in the split analytic table
            INSERT INTO [rule].[splitAnalytic] (splitAnalyticId, splitAssignmentId, name, value, status)
            SELECT spau.splitAnalyticId, spau.splitAssignmentId, spau.name, spau.value, 'approved'
            FROM [rule].[splitAnalyticUnapproved] spau
            JOIN [rule].[splitAssignmentUnapproved] sp ON sp.splitAssignmentId = spau.splitAssignmentId
            JOIN [rule].[splitNameUnapproved] sn ON sp.splitNameId = sn.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitAnalytic] OFF
        END



    -- handle split name
    IF EXISTS(SELECT 1 FROM [rule].[splitName] WHERE conditionId = @conditionId)
        BEGIN
            UPDATE sn
            SET
                sn.name = snu.name,
                sn.tag = snu.tag,
                sn.status = 'approved'
            FROM [rule].[splitName] sn
            INNER JOIN [rule].[splitNameUnapproved] snu ON snu.splitNameId = sn.splitNameId
            WHERE sn.conditionid = @conditionId
        END
    ELSE
        BEGIN
            SET IDENTITY_INSERT [rule].[splitName] ON -- allow split name to be inserted in the split name table
            INSERT INTO [rule].[splitName] (splitNameId, conditionId, name, tag, status)
            SELECT snu.splitNameId, snu.conditionId, snu.name, snu.tag, 'approved'
            FROM [rule].[splitNameUnapproved] snu
            WHERE snu.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitName] OFF
        END



    -- handle split range
    IF EXISTS(
        SELECT 1 FROM [rule].[splitRange] sr
        JOIN [rule].[splitName] sn ON sn.splitNameId = sr.splitNameId
        WHERE sn.conditionId = @conditionId
    )
        BEGIN
            UPDATE sr
            SET
                sr.startAmount = sru.startAmount,
                sr.startAmountCurrency = sru.startAmountCurrency,
                sr.startAmountDaily = sru.startAmountDaily,
                sr.startCountDaily = sru.startCountDaily,
                sr.startAmountWeekly = sru.startAmountWeekly,
                sr.startCountWeekly = sru.startCountWeekly,
                sr.startAmountMonthly = sru.startAmountMonthly,
                sr.startCountMonthly = sru.startCountMonthly,
                sr.isSourceAmount = sru.isSourceAmount,
                sr.minValue = sru.minValue,
                sr.maxValue = sru.maxValue,
                sr.[percent] = sru.[percent],
                sr.percentBase = sru.percentBase,
                sr.status = 'approved'
            FROM [rule].[splitRange] sr
            INNER JOIN [rule].[splitRangeUnapproved] sru ON sru.splitRangeId = sr.splitRangeId
            INNER JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sr.splitNameId
            WHERE sn.conditionId = @conditionId
        END
    ELSE
        BEGIN
            SET IDENTITY_INSERT [rule].[splitRange] ON --allow split range id to be inserted
            INSERT INTO [rule].[splitRange] ( splitRangeId, startAmount, startAmountCurrency, startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly, isSourceAmount, minValue, maxValue, [percent], percentBase, splitNameId, status)
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
                sr.splitNameId,
                'approved'
            FROM [rule].[splitRangeUnapproved] sr
            INNER JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sr.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitRange] OFF
        END



    -- handle split assignment
    IF EXISTS(
        SELECT 1 FROM [rule].[splitAssignment] sa
        JOIN [rule].[splitName] sn ON sn.splitNameId = sa.splitNameId
        WHERE sn.conditionId = @conditionId
    )
        BEGIN
            UPDATE sa
            SET
                sa.debit = sau.debit,
                sa.credit = sau.credit,
                sa.minValue = sau.minValue,
                sa.maxValue = sau.maxValue,
                sa.[percent] = sau.[percent],
                sa.description = sau.description,
                sa.status = 'approved'
            FROM [rule].[splitAssignment] sa
            INNER JOIN [rule].[splitAssignmentUnapproved] sau ON sau.splitAssignmentId = sa.splitAssignmentId
            JOIN [rule].[splitNameUnapproved] sna ON sau.splitNameId = sna.splitNameId
            WHERE sna.conditionId = @conditionId
        END
    ELSE
        BEGIN
            SET IDENTITY_INSERT [rule].[splitAssignment] ON -- allow splitAssignment to be inserted in the split assignment table
            INSERT INTO [rule].[splitAssignment] (splitAssignmentId, splitNameId, debit, credit, minValue, maxValue, [percent], description, status)
            SELECT sa.splitAssignmentId, sa.splitNameId, sa.debit, sa.credit, sa.minValue, sa.maxValue, sa.[percent], sa.description, 'approved'
            FROM [rule].[splitAssignmentUnapproved] sa
            JOIN [rule].[splitNameUnapproved] sn ON sn.splitNameId = sa.splitNameId
            WHERE sn.conditionId = @conditionId
            SET IDENTITY_INSERT [rule].[splitAssignment] OFF
        END


    DECLARE @conditionIds core.arrayList
    INSERT INTO @conditionIds
    SELECT @conditionId
    EXEC [rule].[rule.deleteUnapproved] @conditionId = @conditionIds

    COMMIT TRANSACTION

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION
    EXEC core.error
    RETURN 55555
END CATCH
