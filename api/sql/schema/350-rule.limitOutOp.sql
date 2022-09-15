CREATE TABLE [rule].[limitOutOp] (
    limitId INT IDENTITY(1000, 1) NOT NULL,
    conditionId INT NOT NULL,
    currency VARCHAR(3) NOT NULL,
    minAmountDaily MONEY NULL,
    maxAmountDaily MONEY NULL,
    minAmountWeekly MONEY NULL,
    maxAmountWeekly MONEY NULL,
    minAmountMonthly MONEY NULL,
    maxAmountMonthly MONEY NULL,
    transferTypeId BIGINT NOT NULL,
    CONSTRAINT [pkRuleLimitOutOp] PRIMARY KEY CLUSTERED (limitId ASC),
    CONSTRAINT fkRuleConditionItemOutOp_transferTypeId FOREIGN KEY(transferTypeId) REFERENCES [core].[itemName] (itemNameId),
    CONSTRAINT [fkRuleLimitOutOp_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[conditionOutOp](conditionId)
)
