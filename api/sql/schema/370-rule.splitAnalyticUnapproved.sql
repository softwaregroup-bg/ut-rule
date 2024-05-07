CREATE TABLE [rule].[splitAnalyticUnapproved] (
    splitAnalyticId INT IDENTITY(1000, 1) NOT NULL,
    splitAssignmentId INT NOT NULL,
    [name] VARCHAR(50),
    [value] VARCHAR(100),
    [status] VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT [pkRuleSplitAnalyticUnapproved] PRIMARY KEY CLUSTERED (splitAnalyticId ASC),
    CONSTRAINT [ukRuleSplitAnalyticUnapproved_splitAssignmentId_name] UNIQUE (splitAssignmentId, [name]),
    CONSTRAINT [fkRuleSplitAnalyticUnapproved_ruleSplitName] FOREIGN KEY (splitAssignmentId) REFERENCES [rule].[splitAssignmentUnapproved](splitAssignmentId)
)
