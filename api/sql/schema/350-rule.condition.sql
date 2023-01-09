CREATE TABLE [rule].[condition] (
    conditionId INT IDENTITY(1000, 1) NOT NULL,
    [priority] INT,
    operationStartDate DATETIME,
    operationEndDate DATETIME,
    sourceAccountId NVARCHAR(255),
    destinationAccountId NVARCHAR(255),
    [name] NVARCHAR(100) NOT NULL,
    [description] NVARCHAR(100),
    notes NVARCHAR(1000),
    isDeleted BIT NOT NULL DEFAULT(0), -- a flag to show if the rule is deleted, e.g. 1 - Deleted
    createdBy BIGINT NULL, -- id of the actor
    createdOn DATETIME2 (0) NULL, -- date of the rule created
    updatedBy BIGINT NULL, -- id of the actor
    updatedOn DATETIME2 (0) NULL, --  date of the rule updated
    CONSTRAINT [pkRuleCondition] PRIMARY KEY CLUSTERED ([conditionId] ASC),
    CONSTRAINT [ukRuleConditionName] UNIQUE ([name])
)
