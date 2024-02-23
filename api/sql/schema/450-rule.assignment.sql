ALTER FUNCTION [rule].assignment(
    @splitNameId BIGINT,
    @map [core].[map] READONLY
) RETURNS TABLE AS RETURN (
    SELECT
        [splitAssignmentId],
        [description],
        [percent],
        [minValue],
        [maxValue],
        core.mapReplace(debit, @map) debit,
        core.mapReplace(credit, @map) credit,
        core.mapReplace(quantity, @map) quantity,
        (SELECT [name],
            core.mapReplace([value], @map) AS [value]
        FROM
            [rule].[splitAnalytic] [rows]
        WHERE
            [rows].splitAssignmentId = b.splitAssignmentId
        FOR XML AUTO, TYPE, ROOT
        ) analytics
    FROM
        [rule].splitAssignment b
    WHERE
        splitNameId = @splitNameId
)
