ALTER FUNCTION [rule].falseActorFactorCount(
    @conditionId int,
    @actors [rule].[properties] READONLY
) RETURNS INT AS
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM [rule].conditionActor ci
        LEFT JOIN @actors a ON a.[factor] = ci.factor AND ci.actorId = a.value
        WHERE conditionId = @conditionId
            AND a.factor IS NULL
        )
END
