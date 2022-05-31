USE [impl-paasDev]
    GO
/****** Object:  StoredProcedure [rule].[rule.fetch]    Script Date: 28/05/2022 12:46:10 pm ******/
SET ANSI_NULLS ON
    GO
SET QUOTED_IDENTIFIER ON
    GO
ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT = NULL,
    @pageSize INT = 25,
    -- how many ROWS will be returned per page
    @pageNumber INT = 1,
    -- which page number to display,
    @meta core.metaDataTT READONLY
-- information for the logged user
AS
DECLARE @userId BIGINT = (SELECT [auth.actorId]
FROM @meta)
DECLARE @startRow INT = (@pageNumber - 1) * @pageSize + 1
DECLARE @endRow INT = @startRow + @pageSize - 1

BEGIN

    -- checks if the user has a right to get user
    DECLARE @actionID VARCHAR(100) = OBJECT_SCHEMA_NAME(@@PROCID) + '.' + OBJECT_NAME(@@PROCID), @return INT = 0
    EXEC @return = [user].[permission.check] @actionId = @actionID, @objectId = NULL, @meta = @meta
    IF @return != 0
    BEGIN
        RETURN 55555
    END

    IF @conditionId IS NOT NULL AND NOT EXISTS (SELECT conditionId
        FROM [rule].[condition]
        WHERE conditionId = @conditionId)
        AND
        NOT EXISTS
        (SELECT conditionId
        FROM [rule].[conditionUnapproved]
        WHERE conditionId = @conditionId)
        RAISERROR ('rule.ruleNotExists', 16, 1)

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
        rowNum INT,
        status VARCHAR(20),
        recordsTotal INT
    );
    WITH
        CTE
        AS
        (
            SELECT rc.conditionId,
            rc.[priority],
            rc.operationEndDate,
            rc.operationStartDate,
            rc.sourceAccountId,
            rc.destinationAccountId,
            rc.status,
            ROW_NUMBER() OVER(ORDER BY rc.[priority] ASC) AS rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
            [rule].condition rc
        WHERE (@conditionId IS NULL OR rc.conditionId = @conditionId ) AND rc.isDeleted = 0

    UNION ALL

        SELECT
            urc.conditionId,
            urc.[priority],
            urc.operationEndDate,
            urc.operationStartDate,
            urc.sourceAccountId,
            urc.destinationAccountId,
            urc.status,
            ROW_NUMBER() OVER(ORDER BY urc.[priority] ASC) AS rowNum,
            COUNT(*) OVER(PARTITION BY 1) AS recordsTotal
        FROM
            [rule].conditionUnapproved urc
        WHERE (@conditionId IS NULL OR urc.conditionId = @conditionId ) AND urc.isDeleted = 0
        )

    INSERT INTO #RuleConditions
        ( conditionId, [priority], operationEndDate, operationStartDate, sourceAccountId, destinationAccountId, rowNum, recordsTotal, status)
    SELECT
        conditionId,
        [priority],
        operationEndDate,
        operationStartDate,
        sourceAccountId,
        destinationAccountId,
        rowNum,
        recordsTotal,
        status
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
        rct.status
    FROM #RuleConditions rct

    SELECT 'conditionActor' AS resultSetName
    SELECT
        cca.conditionId, cca.factor, cca.actorId, cca.status,
        CASE WHEN @conditionId IS NOT NULL THEN CAST(cca.actorId AS NVARCHAR) ELSE org.organizationName END AS actorId, a.actorType AS [type]
    -- ca.*, a.actorType AS [type]
    FROM
        (
        SELECT ca.conditionId, ca.status, ca.factor, ca.actorId
            FROM [rule].conditionActor ca

        UNION ALL

            SELECT cau.conditionId, cau.status, cau.factor, cau.actorId
            FROM [rule].conditionActorUnapproved cau

        ) cca
        JOIN #RuleConditions rct ON rct.conditionId = cca.conditionId
        JOIN core.actor a ON a.actorId = cca.actorId
        JOIN customer.organization org ON org.actorId = cca.actorId
    WHERE
        @conditionId IS NULL OR cca.conditionId = @conditionId

    SELECT 'conditionItem' AS resultSetName
    SELECT
        c.conditionId, c.factor, c.status, t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
    FROM
        (
            SELECT ci.conditionId, ci.factor, ci.status, ci.itemNameId
            FROM [rule].conditionItem ci

        UNION ALL

            SELECT ciu.conditionId, ciu.factor, ciu.status, ciu.itemNameId
            FROM [rule].conditionItemUnapproved ciu
        ) c
        JOIN #RuleConditions rct ON rct.conditionId = c.conditionId
        JOIN core.itemName i ON i.itemNameId = c.itemNameId
        JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE
        @conditionId IS NULL OR c.conditionId = @conditionId


    SELECT 'conditionProperty' AS resultSetName
    SELECT
        cp.*
    FROM
        (
            SELECT *
            FROM [rule].conditionProperty

        UNION ALL

            SELECT *
            FROM [rule].conditionPropertyUnapproved
        ) cp
        JOIN #RuleConditions rct ON rct.conditionId = cp.conditionId
    WHERE
        @conditionId IS NULL OR cp.conditionId = @conditionId

    SELECT 'splitName' AS resultSetName
    SELECT
        sn.*
    FROM
        (
            SELECT *
            FROM [rule].splitName

        UNION ALL

            SELECT *
            FROM [rule].splitNameUnapproved
        ) sn
        JOIN #RuleConditions rct ON rct.conditionId = sn.conditionId
    WHERE
        @conditionId IS NULL OR sn.conditionId = @conditionId



    SELECT 'splitRange' AS resultSetName
    SELECT
        sr.*
    FROM
        (
            SELECT *
            FROM [rule].splitRange

        UNION ALL

            SELECT *
            FROM [rule].splitRangeUnapproved
        ) sr
        LEFT JOIN [rule].splitNameUnapproved snu ON snu.splitNameId = sr.splitNameId
        LEFT JOIN [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId OR snu.conditionId = @conditionId

    SELECT 'splitAssignment' AS resultSetName
    SELECT
        sa.*
    FROM
        (
        SELECT *
            FROM [rule].splitAssignment

        UNION ALL

            SELECT *
            FROM [rule].splitAssignmentUnapproved
    ) sa
        LEFT JOIN [rule].splitNameUnapproved snu ON snu.splitNameId = sa.splitNameId
        LEFT JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE @conditionId IS NULL OR sn.conditionId = @conditionId OR snu.conditionId = @conditionId

    SELECT 'limit' AS resultSetName
    SELECT
        l.*
    FROM
        (
    SELECT * FROM [rule].limit

        UNION ALL

            SELECT *
            FROM [rule].limitUnapproved
    ) l
        JOIN #RuleConditions rct ON rct.conditionId = l.conditionId
    WHERE
        @conditionId IS NULL OR l.conditionId = @conditionId

    SELECT 'splitAnalytic' AS resultSetName
    SELECT
        san.*
    FROM
        (
            SELECT *
            FROM [rule].splitAnalytic

        UNION ALL

            SELECT *
            FROM [rule].splitAnalyticUnapproved ) san
        JOIN [rule].splitAssignmentUnapproved sa ON sa.splitAssignmentId = san.splitAssignmentId
        JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
        JOIN #RuleConditions rct ON rct.conditionId = sn.conditionId
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
