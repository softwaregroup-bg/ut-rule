CREATE TABLE [rule].[condition] (
    conditionId INT IDENTITY(1000,1) NOT NULL,
    [priority] INT,
    operationStartDate DATETIME,
    operationEndDate DATETIME,
    sourceAccountId NVARCHAR(255),
    destinationAccountId NVARCHAR(255),
    CONSTRAINT [pkRuleCondition] PRIMARY KEY CLUSTERED ([conditionId] ASC),
    CONSTRAINT [ukRuleCondtitionPriority] UNIQUE ([priority] ASC)
)