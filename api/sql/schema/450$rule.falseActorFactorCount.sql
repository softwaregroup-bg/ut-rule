CREATE FUNCTION [rule].falseActorFactorCount(
    @conditionId int,
    @actors [rule].[properties] READONLY
) RETURNS BIT AS
BEGIN
    RETURN (
        SELECT COUNT(*) FROM [rule].conditionActor WHERE conditionId = @conditionId AND factor NOT IN (
            SELECT
                ca.factor
            FROM
                [rule].conditionActor ca
            JOIN
                @actors a ON a.[factor] = ca.factor AND ca.actorId = a.value
            WHERE
                ca.conditionId = @conditionId
        )
    )
END
