ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT = NULL,
    @operationCode NVARCHAR(200) = NULL, -- used for filtering, the code of the operation for which the rules are defined
    @name NVARCHAR(100) = NULL, -- filter by rule name
    @pageSize INT = 25, -- how many rows will be returned per page
    @pageNumber INT = 1, -- which page number to display,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId]
FROM @meta)
DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN
    -- checks if the user has a right to get user
    -- DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    -- EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    -- IF @return != 0
    -- BEGIN
    --     RETURN 55555
    -- END

    -- IF @conditionId IS NOT NULL AND NOT EXISTS (SELECT conditionId
    --     FROM [rule].[condition]
    --     WHERE conditionId = @conditionId)
    --     AND
    --     NOT EXISTS
    --     (SELECT conditionId
    --     FROM [rule].[conditionUnapproved]
    --     WHERE conditionId = @conditionId)
    --     RAISERROR ('rule.ruleNotExists', 16, 1)

    IF OBJECT_ID('tempdb..#RuleConditions') IS NOT NULL
        DROP TABLE #RuleConditions

    CREATE TABLE #RuleConditions
    (
        conditionId INT,
        [priority] INT,
        operationEndDate DATETIME,
        operationStartDate DATETIME,
        sourceAccountId NVARCHAR(255),
        destinationAccountId NVARCHAR(255),
        [name] NVARCHAR(100),
        [description] NVARCHAR(100),
        notes NVARCHAR(1000),
        rowNum INT,
        status VARCHAR(20),
        recordsTotal INT,
        isEnabled INT
    );
    WITH CTE AS (
        SELECT rc.conditionId,
        rc.[priority],
        rc.operationEndDate,
        rc.operationStartDate,
        rc.sourceAccountId,
        rc.destinationAccountId,
        rc.[name],
        rc.[description],
        rc.notes,
        rc.status,
        rc.isEnabled,
        ROW_NUMBER() OVER(ORDER BY rc.[priority] ASC) AS rowNum,
        COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
        (
            SELECT c.conditionId, CASE WHEN cu.status IS NULL THEN 'approved' ELSE cu.status END AS [status],
            c.[priority], c.operationStartDate, c.operationEndDate, c.sourceAccountId, c.destinationAccountId, c.name, c.description, c.notes, c.[isDeleted], ISNULL(c.isEnabled, cu.isEnabled) AS isEnabled
            FROM [rule].condition c
            LEFT JOIN [rule].conditionUnapproved cu ON cu.conditionId = c.conditionId
            UNION ALL
            SELECT cu.conditionId, cu.status, cu.[priority], cu.operationStartDate, cu.operationEndDate, cu.sourceAccountId, cu.destinationAccountId, cu.name, cu.description, cu.notes, cu.isDeleted, cu.isEnabled
            FROM [rule].conditionUnapproved cu
            LEFT JOIN [rule].condition c ON c.conditionId = cu.conditionId
            WHERE c.conditionId IS NULL
        ) rc
        WHERE (@conditionId IS NULL OR rc.conditionId = @conditionId ) AND rc.isDeleted = 0
    )

    INSERT INTO #RuleConditions (conditionId, [priority], operationEndDate, operationStartDate, sourceAccountId, destinationAccountId, name, description, notes, rowNum, recordsTotal, status, isEnabled)
    SELECT
        conditionId,
        [priority],
        operationEndDate,
        operationStartDate,
        sourceAccountId,
        destinationAccountId,
        name,
        description,
        notes,
        rowNum,
        recordsTotal,
        status,
        isEnabled
    FROM CTE
    WHERE (rowNum BETWEEN @startRow AND @endRow) OR (@startRow >= recordsTotal AND RowNum > recordsTotal - (recordsTotal % @pageSize))

    SELECT 'condition' AS resultSetName
    SELECT
        rct.[conditionId],
        rct.[priority],
        rct.[operationEndDate],
        rct.[operationStartDate],
        rct.[sourceAccountId],
        rct.[destinationAccountId],
        rct.[name],
        rct.[description],
        rct.[notes],
        rct.status,
        rct.isEnabled
    FROM #RuleConditions rct

    SELECT 'conditionActor' AS resultSetName
    SELECT
        cca.conditionId, cca.factor, cca.actorId, --cca.status,
        CASE WHEN org.actorId IS NOT NULL THEN org.organizationName
            WHEN r.actorId IS NOT NULL AND agt.actorId IS NOT NULL THEN r.[name]
            ELSE CAST(cca.actorId AS NVARCHAR)
        END AS actorName,
        CASE WHEN agt.actorId IS NOT NULL THEN 'agentRole' ELSE a.actorType END AS [type]
    FROM (
        SELECT ca.conditionId, ca.factor, ca.actorId
        FROM [rule].conditionActor ca
        UNION
        SELECT cau.conditionId, cau.factor, cau.actorId
        FROM [rule].conditionActorUnapproved cau
    ) cca
    JOIN #RuleConditions rct ON rct.conditionId = cca.conditionId
    JOIN core.actor a ON a.actorId = cca.actorId
    LEFT JOIN customer.organization org ON org.actorId = cca.actorId
    LEFT JOIN [user].[role] r ON r.actorId = cca.actorId
    LEFT JOIN agent.agentType agt ON agt.actorId = r.actorId
    WHERE @conditionId IS NULL OR cca.conditionId = @conditionId

    SELECT 'conditionItem' AS resultSetName
    SELECT c.conditionId, c.factor, c.itemNameId, t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
    FROM (
        SELECT ci.conditionId, ci.factor, ci.itemNameId
        FROM [rule].conditionItem ci
        UNION
        SELECT ciu.conditionId, ciu.factor, ciu.itemNameId
        FROM [rule].conditionItemUnapproved ciu WHERE ciu.status <> 'pending'
    ) c
    JOIN #RuleConditions rct ON rct.conditionId = c.conditionId
    JOIN core.itemName i ON i.itemNameId = c.itemNameId
    JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE @conditionId IS NULL OR c.conditionId = @conditionId

    SELECT 'conditionProperty' AS resultSetName
    SELECT cp.* FROM (
        SELECT conditionId, factor, [name], [value]
        FROM [rule].conditionProperty
        UNION
        SELECT conditionId, factor, [name], [value]
        FROM [rule].conditionPropertyUnapproved
    ) cp
    JOIN #RuleConditions rct ON rct.conditionId = cp.conditionId
    WHERE @conditionId IS NULL OR cp.conditionId = @conditionId

    SELECT 'splitName' AS resultSetName
    SELECT sn.* FROM (
        SELECT splitNameId, conditionId, [name], tag
        FROM [rule].splitName
        UNION
        SELECT splitNameId, conditionId, [name], tag
        FROM [rule].splitNameUnapproved
    ) sn
    JOIN #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'splitRange' AS resultSetName
    SELECT sr.* FROM (
        SELECT splitRangeId, splitNameId, startAmount, startAmountCurrency,
            startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly,
            startAmountMonthly, startCountMonthly, isSourceAmount, minValue,
            maxValue, [percent], percentBase
        FROM [rule].splitRange
        UNION
        SELECT splitRangeId, splitNameId, startAmount, startAmountCurrency,
            startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly,
            startAmountMonthly, startCountMonthly, isSourceAmount, minValue,
            maxValue, [percent], percentBase
        FROM [rule].splitRangeUnapproved
    ) sr
    LEFT JOIN [rule].splitNameUnapproved snu ON snu.splitNameId = sr.splitNameId
    LEFT JOIN [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId OR snu.conditionId = @conditionId

    SELECT 'splitAssignment' AS resultSetName
    SELECT sa.* FROM (
        SELECT splitAssignmentId, splitNameId, debit, credit,
        minValue, maxValue, [percent], [description]
        FROM [rule].splitAssignment
        UNION
        SELECT splitAssignmentId, splitNameId, debit, credit,
        minValue, maxValue, [percent], [description]
        FROM [rule].splitAssignmentUnapproved
    ) sa
    LEFT JOIN [rule].splitNameUnapproved snu ON snu.splitNameId = sa.splitNameId
    LEFT JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId OR snu.conditionId = @conditionId

    SELECT 'limit' AS resultSetName
    SELECT l.* FROM (
        SELECT limitId, conditionId, currency, minAmount, maxAmount, maxAmountDaily,
            maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly,
            maxCountMonthly, [credentials], [priority]
        FROM [rule].[limit]
        UNION
        SELECT limitId, conditionId, currency, minAmount, maxAmount, maxAmountDaily,
            maxCountDaily, maxAmountWeekly, maxCountWeekly, maxAmountMonthly,
            maxCountMonthly, [credentials], [priority]
        FROM [rule].limitUnapproved rl WHERE rl.status <> 'pending'
    ) l
    JOIN #RuleConditions rct ON rct.conditionId = l.conditionId
    WHERE @conditionId IS NULL OR l.conditionId = @conditionId

    SELECT 'rate' AS resultSetName
    SELECT
        r.*
    FROM
        [rule].rate r
    JOIN
        #RuleConditions rct ON rct.conditionId = r.conditionId

    SELECT 'splitAnalytic' AS resultSetName
    SELECT san.* FROM (
        SELECT splitAnalyticId, splitAssignmentId, [name], [value]
        FROM [rule].splitAnalytic
        UNION
        SELECT splitAnalyticId, splitAssignmentId, [name], [value]
        FROM [rule].splitAnalyticUnapproved
    ) san
    JOIN [rule].splitAssignmentUnapproved sa ON sa.splitAssignmentId = san.splitAssignmentId
    JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
    JOIN #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'pagination' AS resultSetName
    SELECT TOP 1
        @pageSize AS pageSize,
        recordsTotal AS recordsTotal,
        CASE WHEN @pageNumber < (recordsTotal - 1) / @pageSize + 1 THEN @pageNumber ELSE (recordsTotal - 1) / @pageSize + 1 END AS pageNumber,
        (recordsTotal - 1) / @pageSize + 1 AS pagesTotal
    FROM #RuleConditions

    DROP TABLE #RuleConditions
END
