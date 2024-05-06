CREATE TABLE [rule].[conditionItemUnapproved] (
    conditionId INT NOT NULL,
    factor CHAR(2) NOT NULL,
    itemNameId BIGINT NOT NULL,
    [status] VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT pkRuleConditionItemUnapproved PRIMARY KEY CLUSTERED (conditionId, factor, itemNameId),
    CONSTRAINT fkRuleConditionItemUnapproved_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[conditionUnapproved](conditionId),
    CONSTRAINT fkRuleConditionItemUnapproved_itemNameId FOREIGN KEY(itemNameId) REFERENCES [core].[itemName] (itemNameId),
    CONSTRAINT ccRuleConditionItemUnapproved_factor CHECK (factor IN ('ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sp', 'dp')) -- source spatial, destination spatial, channel spatial, operation category, source category, destination category
)
