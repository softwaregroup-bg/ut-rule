ALTER FUNCTION [rule].falsePropertyFactorCount(
    @conditionId INT,
    @properties [rule].[properties] READONLY
) RETURNS INT AS
BEGIN
    RETURN (
        ISNULL (
            (SELECT COUNT(*)
            FROM [rule].conditionProperty ct
            JOIN core.actorProperty t ON ct.name = t.name AND ct.value = t.value
            LEFT JOIN @properties p ON t.actorId = p.value AND p.factor IN ('so', 'do', 'co')
            WHERE conditionId = @conditionId
                AND p.factor IS NULL), 0
        ) +
        ISNULL (
            (SELECT COUNT(*)
            FROM [rule].conditionProperty ct
            JOIN core.itemProperty t ON ct.name = t.name AND ct.value = t.value
            LEFT JOIN @properties p ON t.itemNameId = p.value AND p.factor IN ('ss', 'ds', 'cs', 'oc', 'sc', 'dc')
            WHERE conditionId = @conditionId
                AND p.factor IS NULL), 0
        )
    )
END
