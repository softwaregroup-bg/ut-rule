CREATE TABLE [rule].[conditionOutOp] ( -- Outlet and Operator conditions
    conditionId INT IDENTITY(1000, 1) NOT NULL,
    isDeleted BIT NOT NULL DEFAULT(0), -- a flag to show if the rule is deleted, e.g. 1 - Deleted
    createdBy BIGINT NULL, -- id of the actor
    createdOn DATETIME2 (0) NULL, -- date of the rule created
    updatedBy BIGINT NULL, -- id of the actor
    updatedOn DATETIME2 (0) NULL, --  date of the rule updated
    CONSTRAINT [pkRuleConditionOutOp] PRIMARY KEY CLUSTERED ([conditionId] ASC)
)
