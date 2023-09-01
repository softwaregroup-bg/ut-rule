CREATE TABLE [rule].[splitAssignmentUnapproved] (
    splitAssignmentId INT IDENTITY(1000, 1) NOT NULL,
    splitNameId INT NOT NULL,
    debit VARCHAR(50) NULL,
    credit VARCHAR(50) NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL(9, 2),
    [description] VARCHAR(50) NOT NULL,
    [status] VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT [pkRuleSplitAssignmentUnapproved] PRIMARY KEY CLUSTERED (splitAssignmentId ASC),
    CONSTRAINT [fkRuleSplitAssignmentUnapproved_ruleSplitName] FOREIGN KEY (splitNameId) REFERENCES [rule].[splitNameUnapproved](splitNameId)
)
