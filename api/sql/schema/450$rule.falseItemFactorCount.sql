ALTER FUNCTION [rule].[falseItemFactorCount](
    @conditionId int,
    @items [rule].[properties] READONLY
) RETURNS INT AS
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM [rule].conditionItem ci
        LEFT JOIN @items a ON a.[factor] = ci.factor AND ci.itemNameId = a.value
        WHERE conditionId = @conditionId
            AND a.factor IS NULL
    )
END
