ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT,
	@pageSize INT = 25,                       -- how many rows will be returned per page
    @pageNumber INT = 1  					  -- which page number to display
AS

DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN
	;WITH CTE AS (
		SELECT
			rc.[conditionId],
			rc.[destinationAccountId],
			rc.[operationEndDate],
			rc.[operationStartDate],
			rc.[priority],
			rc.[sourceAccountId],
			ROW_NUMBER() OVER(ORDER BY rc.[conditionId] DESC) as [RowNum],
			COUNT(*) OVER(PARTITION BY 1) AS [recordsTotal]
		FROM
			[rule].condition rc
		WHERE
			@conditionId IS NULL OR conditionId = @conditionId)

	SELECT
		cte.[conditionId],
		cte.[destinationAccountId],
		cte.[operationEndDate],
		cte.[operationStartDate],
		cte.[priority],
		cte.[sourceAccountId],
		cte.[RowNum],
		cte.[recordsTotal]
	INTO #RuleConditions
	FROM CTE cte

	SELECT 'condition' AS resultSetName
	SELECT
		rct.[conditionId],
		rct.[destinationAccountId],
		rct.[operationEndDate],
		rct.[operationStartDate],
		rct.[priority],
		rct.[sourceAccountId]
	FROM #RuleConditions rct
	WHERE (RowNum BETWEEN @startRow AND @endRow) OR (@startRow >= recordsTotal AND RowNum > recordsTotal - (recordsTotal % @pageSize))

    SELECT 'conditionActor' AS resultSetName
    SELECT 
        ca.*, a.actorType AS [type]
    FROM 
        [rule].conditionActor ca
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
        core.itemName i ON i.itemNameId = c.itemNameId
    JOIN 
        core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE
        @conditionId IS NULL OR c.conditionId = @conditionId

    
    SELECT 'conditionProperty' AS resultSetName
    SELECT 
        *
    FROM 
        [rule].conditionProperty 
    WHERE
        @conditionId IS NULL OR conditionId = @conditionId

    SELECT 'splitName' AS resultSetName
    SELECT
        *
    FROM
        [rule].splitName
    WHERE
        @conditionId IS NULL OR conditionId = @conditionId

    SELECT 'splitRange' AS resultSetName
    SELECT
        sr.*
    FROM
        [rule].splitRange sr
    JOIN
        [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'splitAssignment' AS resultSetName
    SELECT
        sa.*
    FROM
        [rule].splitAssignment sa
    JOIN
        [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

    SELECT 'limit' AS resultSetName

    SELECT
        *
    FROM
        [rule].limit
    WHERE
        @conditionId IS NULL OR conditionId = @conditionId

    SELECT 'splitAnalytic' AS resultSetName
    SELECT
        san.*
    FROM
	   [rule].splitAnalytic san
    JOIN
        [rule].splitAssignment sa ON sa.splitAssignmentId = san.splitAssignmentId
    JOIN
        [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId

	SELECT 'pagination' AS resultSetName
    SELECT TOP 1
		@pageSize AS pageSize,
		recordsTotal AS recordsTotal,
		CASE WHEN @pageNumber < (recordsTotal - 1) / @pageSize + 1 THEN @pageNumber ELSE (recordsTotal - 1) / @pageSize + 1 END AS pageNumber,
		(recordsTotal - 1) / @pageSize + 1 AS pagesTotal
	FROM #RuleConditions
END