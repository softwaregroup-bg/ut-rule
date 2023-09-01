CREATE TABLE [rule].[splitNameUnapproved] (
    splitNameId INT IDENTITY(1000, 1) NOT NULL,
    conditionId INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    tag VARCHAR(max),
    [status] VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT [pkRuleSplitNameUnapproved] PRIMARY KEY CLUSTERED (splitNameId ASC),
    CONSTRAINT [fkRuleSplitNameUnapproved_ruleCondition] FOREIGN KEY (conditionId) REFERENCES [rule].[conditionUnapproved](conditionId),
    CONSTRAINT [ukRuleSplitNameUnapprovedConditionIdName] UNIQUE (conditionId, name)
)
