CREATE TABLE [rule].[fee] (
    feeId INT IDENTITY NOT NULL,
    conditionId INT NOT NULL,
    startAmount MONEY NOT NULL,
    startAmountCurrency VARCHAR(3) NOT NULL,
    isSourceAmount BIT NOT NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] FLOAT,
    percentBase MONEY,
    CONSTRAINT [pkRuleFee] PRIMARY KEY CLUSTERED (feeId ASC),
    CONSTRAINT ukRuleFeeConditionStartAmount UNIQUE (conditionId, startAmount, startAmountCurrency),
    CONSTRAINT [fkRuleFee_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)