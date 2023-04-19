CREATE TABLE [rule].[splitName] (
    splitNameId INT IDENTITY(1000, 1) NOT NULL,
    conditionId INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    tag VARCHAR(max),
    amountType SMALLINT, -- 1 amount, 2 settlement, else account
    CONSTRAINT [pkRuleSplitName] PRIMARY KEY CLUSTERED (splitNameId ASC),
    CONSTRAINT [fkRuleSplitName_ruleCondition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId),
    CONSTRAINT [ukRuleSplitNameConditionIdName] UNIQUE (conditionId, name)
)
