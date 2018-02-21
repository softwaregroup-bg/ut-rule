CREATE TABLE [rule].[splitAnalytic] (
    splitAnalyticId INT IDENTITY(1000, 1) NOT NULL,
    splitAssignmentId INT NOT NULL,
    [name] VARCHAR(50),
    [value] VARCHAR(100),
    CONSTRAINT [pkRuleSplitAnalytic] PRIMARY KEY CLUSTERED (splitAnalyticId ASC),
    CONSTRAINT [ukRuleSplitAnalytic_splitAssignmentId_name] UNIQUE (splitAssignmentId, [name]),
    CONSTRAINT [fkRuleSplitAnalytic_ruleSplitName] FOREIGN KEY (splitAssignmentId) REFERENCES [rule].[splitAssignment](splitAssignmentId)
)
