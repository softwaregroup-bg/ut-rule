CREATE TABLE [rule].[commission] (
    commissionId INT IDENTITY NOT NULL,
    conditionId INT NOT NULL,
    startAmount MONEY NOT NULL,
    startAmountCurrency VARCHAR(3) NOT NULL,
    isSourceAmount BIT NOT NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] FLOAT,
    percentBase MONEY,
    CONSTRAINT pkRuleCommission PRIMARY KEY CLUSTERED (commissionId ASC),
    CONSTRAINT [fkRuleCommission_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)