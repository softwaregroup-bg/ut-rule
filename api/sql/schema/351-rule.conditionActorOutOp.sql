CREATE TABLE [rule].[conditionActorOutOp] (
    conditionId INT NOT NULL,
    actorId BIGINT NOT NULL,
    [factorLevel] INT NOT NULL, -- 1 = store, 2 = operator
    CONSTRAINT pkRuleConditionActorOutOp PRIMARY KEY CLUSTERED (conditionId, actorId),
    CONSTRAINT fkRuleConditionActorOutOp_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[conditionOutOp](conditionId),
    CONSTRAINT fkRuleConditionActorOutOp_actorId FOREIGN KEY(actorId) REFERENCES [core].[actor] (actorId)
)
