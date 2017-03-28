CREATE FUNCTION [rule].falseItemFactorCount(
    @conditionId int,
    @items [rule].[properties] READONLY
) RETURNS BIGINT AS
BEGIN
    RETURN (
        SELECT COUNT(*) FROM [rule].conditionItem WHERE conditionId = @conditionId AND factor NOT IN (
            SELECT
                ci.factor
            FROM
                [rule].conditionItem ci
            JOIN
                @items a ON a.[factor] = ci.factor AND ci.itemNameId = a.value
            WHERE
                conditionId = @conditionId
        )
    )
END