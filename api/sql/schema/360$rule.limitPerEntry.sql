CREATE TABLE [rule].[limitPerEntry] (
	limitPerEntryId INT IDENTITY(1000,1) NOT NULL,
	conditionId INT NOT NULL,
	currency VARCHAR(3) NOT NULL,
	minAmount MONEY,
	maxAmount MONEY,
	maxAmountDaily MONEY,
	maxCountDaily BIGINT,
	CONSTRAINT [pkRuleLimitPerEntry] PRIMARY KEY CLUSTERED (limitPerEntryId ASC),
    CONSTRAINT ukRuleLimitPerEntryConditionCurrency UNIQUE (conditionId, currency),
	CONSTRAINT [fkRuleLimitPerEntry_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)