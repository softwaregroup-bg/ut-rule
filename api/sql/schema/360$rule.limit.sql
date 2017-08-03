CREATE TABLE [rule].[limit] (
    limitId INT IDENTITY(1000,1) NOT NULL,
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
    [credentials] INT,
    [priority] SMALLINT,
    CONSTRAINT [pkRuleLimit] PRIMARY KEY CLUSTERED (limitId ASC),
    CONSTRAINT ukRuleLimitConditionCurrencyPriority UNIQUE (conditionId, currency, [priority]),
    CONSTRAINT ukRuleLimitConditionCurrencyCredentials UNIQUE (conditionId, currency, [credentials]),
    CONSTRAINT [fkRuleLimit_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)