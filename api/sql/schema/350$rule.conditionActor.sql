CREATE TABLE [rule].[conditionActor] (
    conditionId INT NOT NULL,
    factor char(2) NOT NULL,
    actorId BIGINT NOT NULL,
    CONSTRAINT pkRuleConditionActor PRIMARY KEY CLUSTERED (conditionId, factor, actorId),
    CONSTRAINT fkRuleConditionActor_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId),
    CONSTRAINT fkRuleConditionActor_actorId FOREIGN KEY(actorId) REFERENCES [core].[actor] (actorId),
    CONSTRAINT ccRuleConditionActor_factor CHECK (factor in ('so', 'do', 'co', 'st', 'dt', 'ct')) -- source organization, destination organization, channel organization, source tenant, destination tenant, channel tenant
)