CREATE TABLE [rule].[conditionActorUnapproved] (
    conditionId INT NOT NULL,
    factor CHAR(2) NOT NULL,
    actorId BIGINT NOT NULL,
    status VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT pkRuleConditionActorUnapproved PRIMARY KEY CLUSTERED (conditionId, factor, actorId),
    CONSTRAINT fkRuleConditionActorUnapproved_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[conditionUnapproved](conditionId),
    CONSTRAINT fkRuleConditionActorUnapproved_actorId FOREIGN KEY(actorId) REFERENCES [core].[actor] (actorId),
    CONSTRAINT ccRuleConditionActorUnapproved_factor CHECK (factor IN ('so', 'do', 'co')), -- source organization, destination organization, channel organization
    CONSTRAINT fkRuleConditionActorUnapproved_status FOREIGN KEY(status) REFERENCES [core].[status] (statusId)
)
