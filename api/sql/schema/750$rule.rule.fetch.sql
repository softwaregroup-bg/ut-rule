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