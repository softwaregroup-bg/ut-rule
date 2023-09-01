ALTER PROCEDURE [rule].[rule.get]
    @conditionId INT,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
BEGIN
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
        FROM [rule].condition c
        WHERE c.conditionId = @conditionId
    ) AND NOT EXISTS(
        SELECT 1
        FROM [rule].conditionUnapproved c
        WHERE c.conditionId = @conditionId
    )
        RAISERROR ('rule.ruleNotExists', 16, 1)

    SELECT 'condition' AS resultSetName, 1 single
    SELECT c.[conditionId], c.[priority], c.[operationEndDate],
        c.[operationStartDate], c.[sourceAccountId], c.[destinationAccountId],
        NULL AS rejectReason, CASE WHEN co.status IS NULL THEN 'approved' ELSE co.status END AS [status],
        c.[isEnabled], CASE WHEN co.conditionId IS NULL THEN 1 ELSE 0 END AS [isNew]
    FROM [rule].condition c
    LEFT JOIN [rule].conditionUnapproved co ON co.conditionId = c.conditionId
    WHERE c.conditionId = @conditionId

    SELECT 'conditionUnapproved' AS resultSetName, 1 single
    SELECT c.[conditionId], c.[priority], c.[operationEndDate],
        c.[operationStartDate], c.[sourceAccountId], c.[destinationAccountId],
        c.[rejectReason], CASE WHEN c.isDeleted = 1 THEN 'Deleted' ELSE c.status END [status], c.[isEnabled],
        CASE WHEN co.conditionId IS NULL THEN 1 ELSE 0 END AS [isNew]
    FROM [rule].conditionUnapproved c
    LEFT JOIN [rule].[condition] co ON co.conditionId = c.conditionId
    WHERE c.conditionId = @conditionId

    SELECT 'conditionActor' AS resultSetName
    SELECT /* cca.conditionId, cca.factor, cca.actorId,
        CASE WHEN cau.status IS NULL THEN 'approved' ELSE cau.status END AS [status],
        org.organizationName AS actorName, a.actorType AS [type] */
        cca.conditionId, cca.factor, cca.actorId,
        CASE WHEN cau.status IS NULL THEN 'approved' ELSE cau.status END AS [status],
        CASE WHEN org.actorId IS NOT NULL THEN org.organizationName
            WHEN r.actorId IS NOT NULL AND agt.actorId IS NOT NULL THEN r.[name]
            ELSE CAST(cca.actorId AS NVARCHAR)
        END AS actorName,
        CASE WHEN agt.actorId IS NOT NULL THEN 'agentType' ELSE a.actorType END AS [type]
    FROM [rule].conditionActor cca
    JOIN core.actor a ON a.actorId = cca.actorId
    LEFT JOIN customer.organization org ON org.actorId = cca.actorId
    LEFT JOIN [user].[role] r ON r.actorId = cca.actorId
    LEFT JOIN agent.agentType agt ON agt.actorId = r.actorId
    --JOIN core.actor a ON a.actorId = cca.actorId
    --LEFT JOIN customer.organization org ON org.actorId = cca.actorId
    LEFT JOIN [rule].conditionActorUnapproved cau ON cau.conditionId = cca.conditionId
    WHERE cca.conditionId = @conditionId

    SELECT 'conditionActorUnapproved' AS resultSetName
    SELECT /* cca.conditionId, cca.factor, cca.actorId,
        cca.status, org.organizationName AS actorId, a.actorType AS [type] */
        cca.conditionId, cca.factor, cca.actorId, cca.status,
        CASE WHEN org.actorId IS NOT NULL THEN org.organizationName
            WHEN r.actorId IS NOT NULL AND agt.actorId IS NOT NULL THEN r.[name]
            ELSE CAST(cca.actorId AS NVARCHAR)
        END AS actorName,
        CASE WHEN agt.actorId IS NOT NULL THEN 'agentType' ELSE a.actorType END AS [type]
    FROM [rule].conditionActorUnapproved cca
    JOIN core.actor a ON a.actorId = cca.actorId
    LEFT JOIN customer.organization org ON org.actorId = cca.actorId
    LEFT JOIN [user].[role] r ON r.actorId = cca.actorId
    LEFT JOIN agent.agentType agt ON agt.actorId = r.actorId
    --JOIN core.actor a ON a.actorId = cca.actorId
    --LEFT JOIN customer.organization org ON org.actorId = cca.actorId
    WHERE cca.conditionId = @conditionId

    SELECT 'conditionItem' AS resultSetName
    SELECT c.conditionId, c.factor,
        CASE WHEN ciu.status IS NULL THEN 'approved' ELSE ciu.status END AS [status],
        t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
    FROM [rule].conditionItem AS c
    JOIN core.itemName i ON i.itemNameId = c.itemNameId
    JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    LEFT JOIN [rule].conditionItemUnapproved ciu ON ciu.conditionId = c.conditionId
    WHERE c.conditionId = @conditionId

    SELECT 'conditionItemUnapproved' AS resultSetName
    SELECT c.conditionId, c.factor, c.status, t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
    FROM [rule].conditionItemUnapproved AS c
    JOIN core.itemName i ON i.itemNameId = c.itemNameId
    JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE c.conditionId = @conditionId

    SELECT 'conditionProperty' AS resultSetName
    SELECT cp.conditionId, cp.factor, cp.name, cp.value,
    CASE WHEN cpu.status IS NULL THEN 'approved' ELSE cpu.status END AS [status]
    FROM [rule].conditionProperty cp
    LEFT JOIN [rule].conditionPropertyUnapproved cpu ON cpu.conditionId = cp.conditionId
    WHERE cp.conditionId = @conditionId

    SELECT 'conditionPropertyUnapproved' AS resultSetName
    SELECT cp.*
    FROM [rule].conditionPropertyUnapproved cp
    WHERE cp.conditionId = @conditionId

    SELECT 'splitName' AS resultSetName
    SELECT sn.conditionId, sn.name, sn.splitNameId, sn.tag,
        CASE WHEN snu.status IS NULL THEN 'approved' ELSE snu.status END AS [status]
    FROM [rule].splitName sn
    LEFT JOIN [rule].splitNameUnapproved snu ON snu.conditionId = sn.conditionId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitNameUnapproved' AS resultSetName
    SELECT sn.*
    FROM [rule].splitNameUnapproved sn
    WHERE sn.conditionId = @conditionId

    SELECT 'splitRange' AS resultSetName
    SELECT sr.isSourceAmount, sr.maxValue, sr.minValue, sr.[percent], sr.percentBase, sr.splitNameId, sr.startAmount, sr.startAmountCurrency,
        sr.startAmountDaily, sr.startAmountMonthly, sr.startAmountWeekly, sr.startCountDaily, sr.startCountMonthly, sr.startCountWeekly,
        CASE WHEN sru.status IS NULL THEN 'approved' ELSE sru.status END AS [status]
    FROM [rule].splitRange sr
    JOIN [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    LEFT JOIN [rule].splitNameUnapproved snu ON snu.conditionId = sn.conditionId
    LEFT JOIN [rule].splitRangeUnapproved sru ON sru.splitNameId = snu.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitRangeUnapproved' AS resultSetName
    SELECT sr.*
    FROM [rule].splitRangeUnapproved sr
    JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sr.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitAssignment' AS resultSetName
    SELECT sa.credit, sa.debit, sa.description, sa.maxValue, sa.minValue, sa.[percent], sa.splitAssignmentId, sa.splitNameId,
        CASE WHEN sau.status IS NULL THEN 'approved' ELSE sau.status END AS status
    FROM [rule].splitAssignment sa
    JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    LEFT JOIN [rule].splitAssignmentUnapproved sau ON sau.splitAssignmentId = sa.splitAssignmentId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitAssignmentUnapproved' AS resultSetName
    SELECT sa.*
    FROM [rule].splitAssignmentUnapproved sa
    JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'limit' AS resultSetName
    SELECT l.conditionId, l.credentials, l.currency, l.limitId, l.maxAmount, l.maxAmountDaily, l.maxAmountMonthly, l.maxAmountWeekly,
        l.maxCountDaily, l.maxCountMonthly, l.maxCountWeekly, l.minAmount, l.priority,
        CASE WHEN lu.status IS NULL THEN 'approved' ELSE lu.status END AS [status]
    FROM [rule].limit l
    LEFT JOIN [rule].limitUnapproved lu ON lu.limitId = l.limitId
    WHERE l.conditionId = @conditionId

    SELECT 'limitUnapproved' AS resultSetName
    SELECT l.*
    FROM [rule].limitUnapproved l
    WHERE l.conditionId = @conditionId

    SELECT 'splitAnalytic' AS resultSetName
    SELECT san.name, san.splitAnalyticId, san.splitAssignmentId, san.value,
    CASE WHEN sau.status IS NULL THEN 'approved' ELSE sau.status END AS [status]
    FROM [rule].splitAnalytic san
    JOIN [rule].splitAssignment sa ON sa.splitAssignmentId = san.splitAssignmentId
    JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    LEFT JOIN [rule].splitAnalyticUnapproved sau ON sau.splitAnalyticId = san.splitAnalyticId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitAnalyticUnapproved' AS resultSetName
    SELECT san.*
    FROM [rule].splitAnalyticUnapproved san
    JOIN [rule].splitAssignmentUnapproved sa ON sa.splitAssignmentId = san.splitAssignmentId
    JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId

END
