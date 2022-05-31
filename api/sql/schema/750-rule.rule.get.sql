ALTER PROCEDURE [rule].[rule.get]
    @conditionId INT,
    @meta core.metaDataTT READONLY
-- information for the logged user
AS

BEGIN

    DECLARE @userId BIGINT = (SELECT [auth.actorId]
    FROM @meta)
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
        WHERE c.conditionId = @conditionId)
        AND
        NOT EXISTS(
        SELECT 1
        FROM [rule].conditionUnapproved c
        WHERE c.conditionId = @conditionId)
        RAISERROR ('rule.ruleNotExists', 16, 1)




    SELECT 'condition' AS resultSetName, 1 single
    SELECT
        c.[conditionId],
        c.[priority],
        c.[operationEndDate],
        c.[operationStartDate],
        c.[sourceAccountId],
        c.[destinationAccountId],
        c.status,
        CASE WHEN co.conditionId IS NULL THEN 1 ELSE 0 END AS [isNew]
    FROM [rule].condition c
        LEFT JOIN [rule].conditionUnapproved co ON co.conditionId = c.conditionId
    WHERE c.conditionId = @conditionId

    SELECT 'conditionUnapproved' AS resultSetName, 1 single
    SELECT
        c.[conditionId],
        c.[priority],
        c.[operationEndDate],
        c.[operationStartDate],
        c.[sourceAccountId],
        c.[destinationAccountId],
        c.[rejectReason],
        c.status,
        CASE WHEN co.conditionId IS NULL THEN 1 ELSE 0 END AS [isNew]
    FROM [rule].conditionUnapproved c
        LEFT JOIN [rule].[condition] co ON co.conditionId = c.conditionId
    WHERE c.conditionId = @conditionId




    SELECT 'conditionActor' AS resultSetName
    SELECT
        cca.conditionId, cca.factor, cca.actorId, cca.status, org.organizationName AS actorId, a.actorType AS [type] -- ca.*, a.actorType AS [type]
    FROM [rule].conditionActor cca
    JOIN
        core.actor a ON a.actorId = cca.actorId
    JOIN
        customer.organization org ON org.actorId = cca.actorId
    WHERE cca.conditionId = @conditionId

    SELECT 'conditionActorUnapproved' AS resultSetName
    SELECT
        cca.conditionId, cca.factor, cca.actorId, cca.status, org.organizationName AS actorId, a.actorType AS [type] -- ca.*, a.actorType AS [type]
    FROM [rule].conditionActorUnapproved cca
    JOIN
        core.actor a ON a.actorId = cca.actorId
    JOIN
        customer.organization org ON org.actorId = cca.actorId
    WHERE cca.conditionId = @conditionId



    SELECT 'conditionItem' AS resultSetName
    SELECT
        c.conditionId, c.factor, c.status, t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
    FROM [rule].conditionItem AS c
        JOIN core.itemName i ON i.itemNameId = c.itemNameId
        JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE c.conditionId = @conditionId


    SELECT 'conditionItemUnapproved' AS resultSetName
    SELECT
        c.conditionId, c.factor, c.status, t.alias AS [type], t.name AS itemTypeName, i.itemName AS itemName
        FROM [rule].conditionItemUnapproved AS c
        JOIN core.itemName i ON i.itemNameId = c.itemNameId
        JOIN core.itemType t ON t.itemTypeId = i.itemTypeId
    WHERE c.conditionId = @conditionId



    SELECT 'conditionProperty' AS resultSetName
    SELECT
        cp.*
    FROM [rule].conditionProperty cp
    WHERE cp.conditionId = @conditionId


    SELECT 'conditionPropertyUnapproved' AS resultSetName
    SELECT
        cp.*
    FROM [rule].conditionPropertyUnapproved cp
    WHERE cp.conditionId = @conditionId




    SELECT 'splitName' AS resultSetName
    SELECT
        sn.*
    FROM [rule].splitName sn
    WHERE sn.conditionId = @conditionId

    SELECT 'splitNameUnapproved' AS resultSetName
    SELECT
        sn.*
    FROM [rule].splitNameUnapproved sn
    WHERE sn.conditionId = @conditionId



    SELECT 'splitRange' AS resultSetName
    SELECT
        sr.*
    FROM [rule].splitRange sr
        JOIN [rule].splitName sn ON sn.splitNameId = sr.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitRangeUnapproved' AS resultSetName
    SELECT
        sr.*
    FROM [rule].splitRangeUnapproved sr
        JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sr.splitNameId
    WHERE sn.conditionId = @conditionId




    SELECT 'splitAssignment' AS resultSetName
    SELECT
        sa.*
    FROM [rule].splitAssignment sa
        JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitAssignmentUnapproved' AS resultSetName
    SELECT
        sa.*
    FROM [rule].splitAssignmentUnapproved sa
        JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId




    SELECT 'limit' AS resultSetName
    SELECT
        l.*
    FROM [rule].limit l
    WHERE l.conditionId = @conditionId

    SELECT 'limitUnapproved' AS resultSetName
    SELECT
        l.*
    FROM [rule].limitUnapproved l
    WHERE l.conditionId = @conditionId




    SELECT 'splitAnalytic' AS resultSetName
    SELECT
        san.*
    FROM [rule].splitAnalytic san
        JOIN [rule].splitAssignment sa ON sa.splitAssignmentId = san.splitAssignmentId
        JOIN [rule].splitName sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId

    SELECT 'splitAnalyticUnapproved' AS resultSetName
    SELECT
        san.*
    FROM [rule].splitAnalyticUnapproved san
        JOIN [rule].splitAssignmentUnapproved sa ON sa.splitAssignmentId = san.splitAssignmentId
        JOIN [rule].splitNameUnapproved sn ON sn.splitNameId = sa.splitNameId
    WHERE sn.conditionId = @conditionId

END
