ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT = NULL,
    @operationCode NVARCHAR(200) = NULL, -- used for filtering, the code of the operation for which the rules are defined
    @name NVARCHAR(100) = NULL, -- filter by rule name
    @pageSize INT = 25, -- how many rows will be returned per page
    @pageNumber INT = 1, -- which page number to display,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
SET NOCOUNT ON

BEGIN
    IF @conditionId IS NOT NULL AND NOT EXISTS (SELECT conditionid FROM [rule].[condition] WHERE conditionId = @conditionId)
        RAISERROR ('rule.ruleNotExists', 16, 1)

    DECLARE @operationId BIGINT = (SELECT itemNameId FROM core.itemName i
        JOIN core.itemType it ON i.itemTypeId = it.itemTypeId
        WHERE it.alias = 'operation' AND i.itemCode = @operationCode)

    DECLARE @recordsTotal INT = 0

    IF OBJECT_ID('tempdb..#RuleConditions') IS NOT NULL
        DROP TABLE #RuleConditions

    CREATE TABLE #RuleConditions (
        conditionId INT,
        [priority] INT,
        operationEndDate DATETIME,
        operationStartDate DATETIME,
        sourceAccountId NVARCHAR(255),
        destinationAccountId NVARCHAR(255),
        [name] NVARCHAR(100),
        [description] NVARCHAR(100),
        notes NVARCHAR(1000),
        createdOn DATETIME,
        updatedOn DATETIME,
        rowNum INT,
        recordsTotal INT)

    INSERT INTO #RuleConditions(conditionId, [priority], operationEndDate, operationStartDate, sourceAccountId,
        destinationAccountId, [name], [description], notes, createdOn, updatedOn, rowNum, recordsTotal)
    SELECT rc.conditionId, rc.[priority], rc.operationEndDate, rc.operationStartDate,
        rc.sourceAccountId, rc.destinationAccountId, rc.[name], rc.[description], rc.notes, rc.createdOn, rc.updatedOn,
        ROW_NUMBER() OVER(ORDER BY rc.[priority] ASC) AS rowNum,
        COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
    FROM [rule].condition rc
    WHERE (@conditionId IS NULL OR rc.conditionId = @conditionId )
        AND (@name IS NULL OR rc.[name] LIKE '%' + @name + '%')
        AND rc.isDeleted = 0
        AND (@operationId IS NULL
            OR EXISTS(SELECT * FROM [rule].conditionItem ri WHERE ri.conditionId = rc.conditionId AND ri.factor = 'oc' AND ri.itemNameId = @operationId))
    ORDER BY rc.[priority] ASC
        OFFSET (@pageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY

    SET @recordsTotal = ISNULL((SELECT TOP 1 recordsTotal FROM #RuleConditions), 0)

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
        rct.[createdOn],
        rct.[updatedOn]
    FROM #RuleConditions rct
    ORDER BY rct.[priority] ASC

    SELECT 'conditionActor' AS resultSetName
    SELECT
        ca.*, a.actorType AS [type], co.organizationName
    FROM
        [rule].conditionActor ca
    JOIN
        #RuleConditions rct ON rct.conditionId = ca.conditionId
    JOIN
        core.actor a ON a.actorId = ca.actorId
    LEFT JOIN [customer].[organization] co ON co.actorId = ca.actorId

    SELECT 'conditionItem' AS resultSetName
    SELECT
        c.*, t.alias AS [type], t.name AS itemTypeName, i.itemName
    FROM
        [rule].conditionItem c
    JOIN
        #RuleConditions rct ON rct.conditionId = c.conditionId
    JOIN
        core.itemName i ON i.itemNameId = c.itemNameId
    JOIN
        core.itemType t ON t.itemTypeId = i.itemTypeId

    SELECT 'conditionProperty' AS resultSetName
    SELECT
        cp.*
    FROM
        [rule].conditionProperty cp
    JOIN
        #RuleConditions rct ON rct.conditionId = cp.conditionId

    SELECT 'splitName' AS resultSetName
    SELECT
        sn.*
    FROM
        [rule].splitName sn
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId

    SELECT 'splitRange' AS resultSetName
    SELECT
        sr.*
    FROM
        [rule].splitRange sr
    JOIN
        [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId
    ORDER BY
        sr.startCountMonthly DESC,
        sr.startAmountMonthly DESC,
        sr.startCountWeekly DESC,
        sr.startAmountWeekly DESC,
        sr.startCountDaily DESC,
        sr.startAmountDaily DESC,
        sr.startAmount DESC,
        sr.splitRangeId

    SELECT 'splitAssignment' AS resultSetName
    SELECT
        sa.*
    FROM
        [rule].splitAssignment sa
    JOIN
        [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    JOIN
        #RuleConditions rct ON rct.conditionId = sn.conditionId

    SELECT 'limit' AS resultSetName
    SELECT
        l.*
    FROM
        [rule].limit l
    JOIN
        #RuleConditions rct ON rct.conditionId = l.conditionId

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

    SELECT 'pagination' AS resultSetName
    SELECT @pageSize AS pageSize, @recordsTotal AS recordsTotal, @pageNumber AS pageNumber, (@recordsTotal - 1) / @pageSize + 1 AS pagesTotal

    DROP TABLE #RuleConditions
END
