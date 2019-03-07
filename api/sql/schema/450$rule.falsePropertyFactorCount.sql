ALTER FUNCTION [rule].[falsePropertyFactorCount](
    @conditionId INT,
    @properties [rule].[properties] READONLY
) RETURNS BIGINT AS
BEGIN
    RETURN (
        SELECT COUNT(*) FROM [rule].conditionProperty WHERE conditionId = @conditionId AND factor NOT IN (
            SELECT
                p.factor
            FROM
                @properties p
            JOIN
                core.actorProperty t ON t.actorId = p.value
            JOIN
                [rule].conditionProperty ct ON ct.name = t.name AND ct.value = t.value
            WHERE
                p.factor IN ('so', 'do', 'co') AND
                ct.conditionId = @conditionId
            UNION SELECT
                p.factor
            FROM
                @properties p
            JOIN
                core.itemProperty t ON t.itemNameId = p.value
            JOIN
                [rule].conditionProperty ct ON ct.name = t.name AND ct.value = t.value
            WHERE
                p.factor IN ('ss', 'ds', 'cs', 'oc', 'sc', 'dc') AND
                ct.conditionId = @conditionId
        )
    )
END
