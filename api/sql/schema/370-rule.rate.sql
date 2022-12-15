CREATE TABLE [rule].[rate] (
    rateId INT IDENTITY(1000, 1) NOT NULL,
    conditionId INT NOT NULL,
    targetCurrency VARCHAR(3) NOT NULL,
    startAmount MONEY NOT NULL,
    startAmountCurrency VARCHAR(3) NOT NULL,
    startAmountDaily MONEY NOT NULL,
    startCountDaily BIGINT NOT NULL,
    startAmountWeekly MONEY NOT NULL,
    startCountWeekly BIGINT NOT NULL,
    startAmountMonthly MONEY NOT NULL,
    startCountMonthly BIGINT NOT NULL,
    rate FLOAT,
    CONSTRAINT [pkRuleRate] PRIMARY KEY CLUSTERED (rateId ASC),
    CONSTRAINT [ukRuleRate_conditionId__startAmount__startAmountCurrency] UNIQUE (conditionId, targetCurrency, startAmount, startAmountCurrency, startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly),
    CONSTRAINT [fkRuleRate_ruleCondition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)
