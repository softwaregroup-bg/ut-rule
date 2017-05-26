ALTER PROCEDURE [rule].[rule.fetch]
    @conditionId INT
AS
BEGIN
    SELECT 'condition' AS resultSetName
    SELECT
        *
    FROM
        [rule].condition
    WHERE
        @conditionId IS NULL OR conditionId = @conditionId
    
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

END