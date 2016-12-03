CREATE TABLE [rule].[limit] (
	limitId INT IDENTITY NOT NULL,
	conditionId INT NOT NULL,
	currency VARCHAR(3) NOT NULL,
	minAmount MONEY,
	maxAmount MONEY,
	maxAmountDaily MONEY,
	maxCountDaily BIGINT,
	maxAmountWeekly MONEY,
	maxCountWeekly BIGINT,
	maxAmountMonthly MONEY,
	maxCountMonthly BIGINT,
	CONSTRAINT [pkRuleLimit] PRIMARY KEY CLUSTERED (limitId ASC),
    CONSTRAINT ukRuleLimitConditionCurrency UNIQUE (conditionId, currency),
	CONSTRAINT [fkRuleLimit_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)