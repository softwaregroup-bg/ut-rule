CREATE TABLE [rule].[splitName] (
    splitNameId INT IDENTITY NOT NULL,
    conditionId INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT [pkRuleSplitName] PRIMARY KEY CLUSTERED (splitNameId ASC),
    CONSTRAINT [fkRuleSplitName_ruleCondition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)