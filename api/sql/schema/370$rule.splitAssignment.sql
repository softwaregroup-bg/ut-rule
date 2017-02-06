CREATE TABLE [rule].[splitAssignment] (
    splitAssignmentId INT IDENTITY(1000,1) NOT NULL,
    splitNameId INT NOT NULL,
    debit VARCHAR(50) NOT NULL,
    credit VARCHAR(50) NOT NULL,
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL,
    description VARCHAR(50) NOT NULL,
    CONSTRAINT [pkRuleSplitAssignment] PRIMARY KEY CLUSTERED (splitAssignmentId ASC),
    CONSTRAINT [fkRuleSplitAssignment_ruleSplitName] FOREIGN KEY (splitNameId) REFERENCES [rule].[splitName](splitNameId)
)