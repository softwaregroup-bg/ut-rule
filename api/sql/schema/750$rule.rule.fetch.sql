ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT = NULL,
    @pageSize INT = 25,    -- how many rows will be returned per page
    @pageNumber INT = 1   -- which page number to display
AS

DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN
    
    IF OBJECT_ID('tempdb..#RuleConditions') IS NOT NULL
        DROP TABLE #RuleConditions
    
    CREATE TABLE #RuleConditions (
        conditionId INT,
        [priority] INT, 
        operationStartDate DATETIME, 
        operationEndDate DATETIME, 
        sourceAccountId NVARCHAR(255), 
        destinationAccountId NVARCHAR(255),
        rowNum INT, 
        recordsTotal INT)
    
    ;WITH CTE AS (
        SELECT
            rc.conditionId,
            rc.[priority],
            rc.operationEndDate,
            rc.operationStartDate,
            rc.sourceAccountId,
            rc.destinationAccountId,
            ROW_NUMBER() OVER(ORDER BY rc.[priority] DESC) as rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
            [rule].condition rc
        WHERE
            @conditionId IS NULL OR rc.conditionId = @conditionId)

    INSERT INTO #RuleConditions( conditionId, [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId, rowNum, recordsTotal)
    SELECT
        conditionId,
        [priority],
        operationEndDate,
        operationStartDate,
        sourceAccountId,
        destinationAccountId,
        rowNum,
        recordsTotal
    FROM CTE
    WHERE (rowNum BETWEEN @startRow AND @endRow) OR (@startRow >= recordsTotal AND RowNum > recordsTotal - (recordsTotal % @pageSize))
    ORDER BY [priority] DESC

    SELECT 'condition' AS resultSetName
    SELECT
        rct.[conditionId],
        rct.[priority],
        rct.[operationEndDate],
        rct.[operationStartDate],
        rct.[sourceAccountId],
        rct.[destinationAccountId]
    FROM #RuleConditions rct

    SELECT 'conditionActor' AS resultSetName
    SELECT
        ca.*, a.actorType AS [type]
    FROM
        [rule].conditionActor ca
    JOIN
        #RuleConditions rct ON rct.conditionId = ca.conditionId
    JOIN
        core.actor a ON a.actorId = ca.actorId
    WHERE
        @conditionId IS NULL OR ca.conditionId = @conditionId

    SELECT 'conditionItem' AS resultSetName
    SELECT
        c.*, t.alias AS [type], t.name as itemTypeName, i.itemName
    FROM
        [rule].conditionItem c
    JOIN
        #RuleConditions rct ON rct.conditionId = c.conditionId
    JOIN
        core.itemName i ON i.itemNameId = c.itemNameId
    JOIN
        core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE
        @conditionId IS NULL OR c.conditionId = @conditionId


    SELECT 'conditionProperty' AS resultSetName
    SELECT
        cp.*
    FROM
        [rule].conditionProperty cp
    JOIN
        #RuleConditions rct ON rct.conditionId = cp.conditionId
    WHERE
        @conditionId IS NULL OR cp.conditionId = @conditionId

    SELECT 'splitName' AS resultSetName
    SELECT
        sn.*
    FROM
        [rule].splitName sn
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'splitRange' AS resultSetName
    SELECT
        sr.*
    FROM
        [rule].splitRange sr
    JOIN
        [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'splitAssignment' AS resultSetName
    SELECT
        sa.*
    FROM
        [rule].splitAssignment sa
    JOIN
        [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'limit' AS resultSetName
    SELECT
        l.*
    FROM
        [rule].limit l
    JOIN
        #RuleConditions rct ON rct.conditionId = l.conditionId
    WHERE
        @conditionId IS NULL OR l.conditionId = @conditionId

    SELECT 'splitAnalytic' AS resultSetName
    SELECT
        san.*
    FROM
        [rule].splitAnalytic san
    JOIN
        [rule].splitAssignment sa ON sa.splitAssignmentId = san.splitAssignmentId
    JOIN
        [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'pagination' AS resultSetName
    SELECT TOP 1
        @pageSize AS pageSize,
        recordsTotal AS recordsTotal,
        CASE WHEN @pageNumber < (recordsTotal - 1) / @pageSize + 1 THEN @pageNumber ELSE (recordsTotal - 1) / @pageSize + 1 END AS pageNumber,
        (recordsTotal - 1) / @pageSize + 1 AS pagesTotal
    FROM #RuleConditions

    DROP TABLE #RuleConditions
END