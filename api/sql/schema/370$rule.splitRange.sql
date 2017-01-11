CREATE TABLE [rule].[splitRange] (
    splitRangeId INT IDENTITY NOT NULL,
    splitNameId INT NOT NULL,
    startAmount MONEY NOT NULL,
    startAmountCurrency VARCHAR(3) NOT NULL,
    isSourceAmount BIT NOT NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL,
    percentBase MONEY,
    CONSTRAINT [pkRuleSplitRange] PRIMARY KEY CLUSTERED (splitRangeId ASC),
    CONSTRAINT [ukRuleSplitRange_splitNameId__startAmount__startAmountCurrency] UNIQUE (splitNameId, startAmount, startAmountCurrency),
    CONSTRAINT [fkRuleSplitRange_ruleSplitName] FOREIGN KEY (splitNameId) REFERENCES [rule].[splitName](splitNameId)
)