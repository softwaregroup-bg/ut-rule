ALTER PROCEDURE [rule].[rule.fetchDeleted]
    @conditionId INT = NULL,
    @pageSize INT = 25, -- how many rows will be returned per page
    @pageNumber INT = 1, -- which page number to display,
    @meta core.metaDataTT READONLY -- information for the user that makes the operation
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)

DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN
    --checks IF the user has a RIGHT to make the operation
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF OBJECT_ID('tempdb..#RuleConditions') IS NOT NULL
        DROP TABLE #DeletedRuleConditions

    CREATE TABLE #DeletedRuleConditions (
        conditionId INT,
        [priority] VARCHAR(100),
        operationEndDate DATETIME,
        operationStartDate DATETIME,
        sourceAccountId NVARCHAR(255),
        destinationAccountId NVARCHAR(255),
        rowNum INT,
        recordsTotal INT)

        ;WITH CTE AS (
        SELECT
            rc.conditionId,
            CAST(rc.[priority] AS varchar(100)) + ' deleted ' + CASE WHEN rc.updatedOn IS NULL THEN ' ' ELSE (CONVERT(NVARCHAR(30), rc.updatedOn, 109)) END AS priority,
            rc.operationEndDate,
            rc.operationStartDate,
            rc.sourceAccountId,
            rc.destinationAccountId,
            ROW_NUMBER() OVER(ORDER BY rc.[priority] ASC) AS rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
            [rule].condition rc
        WHERE
            (@conditionId IS NULL OR rc.conditionId = @conditionId ) AND rc.isDeleted = 1 )

    INSERT INTO #DeletedRuleConditions( conditionId, [priority], operationEndDate, operationStartDate, sourceAccountId, destinationAccountId, rowNum, recordsTotal)
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


    SELECT 'condition' AS resultSetName
    SELECT
        rct.[conditionId],
        rct.[priority],
        rct.[operationEndDate],
        rct.[operationStartDate],
        rct.[sourceAccountId],
        rct.[destinationAccountId]
    FROM #DeletedRuleConditions rct

    SELECT 'pagination' AS resultSetName
    SELECT TOP 1
        @pageSize AS pageSize,
        recordsTotal AS recordsTotal,
        CASE WHEN @pageNumber < (recordsTotal - 1) / @pageSize + 1 THEN @pageNumber ELSE (recordsTotal - 1) / @pageSize + 1 END AS pageNumber,
        (recordsTotal - 1) / @pageSize + 1 AS pagesTotal
    FROM #DeletedRuleConditions

    DROP TABLE #DeletedRuleConditions
END
