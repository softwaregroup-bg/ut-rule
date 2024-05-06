CREATE TABLE [rule].[conditionItem] (
    conditionId INT NOT NULL,
    factor CHAR(2) NOT NULL,
    itemNameId BIGINT NOT NULL,
    CONSTRAINT pkRuleConditionItem PRIMARY KEY CLUSTERED (conditionId, factor, itemNameId),
    CONSTRAINT fkRuleConditionItem_conditionId FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId),
    CONSTRAINT fkRuleConditionItem_itemNameId FOREIGN KEY(itemNameId) REFERENCES [core].[itemName] (itemNameId),
    CONSTRAINT ccRuleConditionItem_factor1 CHECK (factor IN ('ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sp', 'dp')) -- source spatial, destination spatial, channel spatial, operation category, source category, destination category, source account fee policy, destination account fee policy
)
