CREATE TYPE [rule].[conditionActorCustom] AS TABLE(
    conditionName NVARCHAR(100),
    factor CHAR(2),
    actorId BIGINT
)
