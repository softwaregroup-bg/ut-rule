CREATE FUNCTION [rule].assignment(
    @splitNameId bigint,
    @map [core].[map] READONLY
) RETURNS TABLE AS RETURN (
    SELECT
        [description],
        [percent],
        [minValue],
        [maxValue],
        core.mapReplace(debit, @map) debit,
        core.mapReplace(credit, @map) credit
    FROM
        [rule].splitAssignment
    WHERE
        splitNameId = @splitNameId
)