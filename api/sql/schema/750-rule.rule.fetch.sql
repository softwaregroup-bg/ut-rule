ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT = NULL,
    @pageSize INT = 25, -- how many rows will be returned per page
    @pageNumber INT = 1, -- which page number to display,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN

    IF @conditionId IS NOT NULL AND NOT EXISTS (SELECT conditionid FROM [rule].[condition] WHERE conditionId = @conditionId)
        RAISERROR ('rule.ruleNotExists', 16, 1)

    IF OBJECT_ID('tempdb..#RuleConditions') IS NOT NULL
        DROP TABLE #RuleConditions

    CREATE TABLE #RuleConditions (
        conditionId INT,
        [priority] INT,
        operationEndDate DATETIME,
        operationStartDate DATETIME,
        sourceAccountId NVARCHAR(255),
        destinationAccountId NVARCHAR(255),
        agentTypeId BIGINT,
        superAgentId BIGINT,
        financialInstitutionId BIGINT,
        agentTypeName VARCHAR(100),
        superAgent VARCHAR(100),
        financialInstitution VARCHAR(100),
        rowNum INT,
        recordsTotal INT);
    WITH CTE AS (
        SELECT
            rc.conditionId,
            rc.[priority],
            rc.operationEndDate,
            rc.operationStartDate,
            rc.sourceAccountId,
            rc.destinationAccountId,
            rc.agentTypeId,
            rc.superAgentId,
            rc.financialInstitutionId,
            ur.name AS agentTypeName,
            asg.commercialName AS superAgent,
            ci.commercialName AS financialInstitution,
            ROW_NUMBER() OVER(ORDER BY rc.[priority] ASC) AS rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM [rule].condition rc
        LEFT JOIN [agent].[superAgent] asg ON rc.superAgentId = asg.actorId
        LEFT JOIN [agent].[institution] ci ON rc.financialInstitutionId = ci.actorId
        LEFT JOIN [agent].[agentType] aat ON aat.actorId = rc.agentTypeId
        JOIN [user].[role] ur ON ur.actorId = aat.actorId AND ur.isEnabled = 1
        WHERE
            (@conditionId IS NULL OR rc.conditionId = @conditionId ) AND rc.isDeleted = 0 )

    INSERT INTO #RuleConditions( conditionId, [priority], operationEndDate, operationStartDate, sourceAccountId, destinationAccountId, agentTypeId, superAgentId, agentTypeName, financialInstitutionId, superAgent, financialInstitution, rowNum, recordsTotal)
    SELECT
        conditionId,
        [priority],
        operationEndDate,
        operationStartDate,
        sourceAccountId,
        destinationAccountId,
        agentTypeId,
        superAgentId,
        agentTypeName,
        financialInstitutionId,
        superAgent,
        financialInstitution,
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
        rct.[destinationAccountId],
        rct.[agentTypeId],
        rct.[superAgentId],
        rct.[agentTypeName],
        rct.[financialInstitutionId],
        rct.[superAgent],
        rct.[financialInstitution]
    FROM #RuleConditions rct

    SELECT 'conditionActor' AS resultSetName
    SELECT
        ca.*, a.actorType AS [type], co.[organizationName]
    FROM
        [rule].conditionActor ca
    JOIN
        #RuleConditions rct ON rct.conditionId = ca.conditionId
    JOIN
        core.actor a ON a.actorId = ca.actorId
    LEFT JOIN
        [customer].[organization] co ON co.actorId = a.actorId AND a.actorType = 'organization'
    WHERE
        @conditionId IS NULL OR ca.conditionId = @conditionId

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
