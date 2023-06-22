CREATE TABLE [rule].[condition] (
    conditionId INT IDENTITY(1000, 1) NOT NULL,
    [priority] INT,
    operationStartDate DATETIME,
    operationEndDate DATETIME,
    sourceAccountId NVARCHAR(255),
    destinationAccountId NVARCHAR(255),
    isEnabled BIT NOT NULL DEFAULT(1), -- a flag to show if the user is enabled or locked
    isDeleted BIT NOT NULL DEFAULT(0), -- a flag to show if the rule is deleted, e.g. 1 - Deleted
    createdBy BIGINT NULL, -- id of the actor
    createdOn DATETIME2 (0) NULL, -- date of the rule created
    updatedBy BIGINT NULL, -- id of the actor
    updatedOn DATETIME2 (0) NULL, --  date of the rule updated
    [status] VARCHAR(20) NULL DEFAULT('pending'),
    CONSTRAINT [pkRuleCondition] PRIMARY KEY CLUSTERED ([conditionId] ASC)
)
