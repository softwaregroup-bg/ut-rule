CREATE TABLE [rule].[commission] (
    commissionId INT IDENTITY NOT NULL,
    conditionId INT NOT NULL,
    startAmount MONEY NOT NULL,
    startAmountCurrency VARCHAR(3) NOT NULL,
    isSourceAmount BIT NOT NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL,
    percentBase MONEY,
    CONSTRAINT pkRuleCommission PRIMARY KEY CLUSTERED (commissionId ASC),
    CONSTRAINT ukRuleCommissionConditionStartAmount UNIQUE (conditionId, startAmount, startAmountCurrency),
    CONSTRAINT [fkRuleCommission_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)