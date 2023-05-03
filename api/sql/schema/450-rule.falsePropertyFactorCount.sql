ALTER FUNCTION [rule].falsePropertyFactorCount(
    @conditionId INT,
    @properties [rule].[properties] READONLY
) RETURNS BIGINT AS
BEGIN
    RETURN (
        SELECT COUNT(*) FROM [rule].conditionProperty WHERE conditionId = @conditionId
            AND CASE factor WHEN 'tp' THEN factor + name ELSE factor END NOT IN (
            SELECT
                p.factor
            FROM
                @properties p
            JOIN
                core.actorProperty t ON t.actorId = p.value
            JOIN
                [rule].conditionProperty ct ON p.factor = ct.factor AND ct.name = t.name AND ct.value = t.value
            WHERE
                p.factor IN ('so', 'do', 'co') AND
                ct.conditionId = @conditionId
            UNION ALL
            SELECT
                p.factor
            FROM
                @properties p
            JOIN
                core.itemProperty t ON t.itemNameId = p.value
            JOIN
                [rule].conditionProperty ct ON p.factor = ct.factor AND ct.name = t.name AND ct.value = t.value
            WHERE
                p.factor IN ('ss', 'ds', 'cs', 'oc', 'sc', 'dc') AND
                ct.conditionId = @conditionId
            UNION ALL
            SELECT
                p.factor
            FROM
                @properties p
            JOIN
                [rule].conditionProperty ct ON p.factor = ct.factor AND ct.name = p.name AND ct.value = p.value
            WHERE
                p.factor IN ('sk', 'st', 'dk', 'dt') AND
                ct.conditionId = @conditionId
            UNION ALL
            SELECT
                p.factor + SUBSTRING(p.name, 10, 200)
            FROM
                @properties p
            JOIN
                [rule].conditionProperty ct ON p.factor = ct.factor AND ct.name = SUBSTRING(p.name, 10, 200) AND ct.value = p.value
            WHERE
                p.factor = 'tp' AND
                ct.conditionId = @conditionId
        )
    )
END
