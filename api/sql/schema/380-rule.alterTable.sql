IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'credentials' AND OBJECT_ID = OBJECT_ID(N'rule.limit') )
BEGIN
    ALTER TABLE [rule].[limit] ADD [credentials] INT
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'priority' AND OBJECT_ID = OBJECT_ID(N'rule.limit') )
BEGIN
    ALTER TABLE [rule].[limit] ADD [priority] SMALLINT
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionCurrency' )
BEGIN
    ALTER TABLE [rule].[limit] DROP CONSTRAINT ukRuleLimitConditionCurrency
END

IF NOT EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionCurrencyPriority' )
BEGIN
    ALTER TABLE [rule].[limit] ADD CONSTRAINT ukRuleLimitConditionCurrencyPriority UNIQUE (conditionId, currency, [priority])
END

IF NOT EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionCurrencyCredentials' )
BEGIN
    ALTER TABLE [rule].[limit] ADD CONSTRAINT ukRuleLimitConditionCurrencyCredentials UNIQUE (conditionId, currency, [credentials])
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'isDeleted' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [isDeleted] BIT NOT NULL DEFAULT(0)
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'createdBy' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [createdBy] BIGINT NULL
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'createdOn' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [createdOn] DATETIME2 (0) NULL
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'updatedBy' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [updatedBy] BIGINT NULL
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'updatedOn' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [updatedOn] DATETIME2 (0) NULL
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleCondtitionPriority')
BEGIN
    ALTER TABLE [rule].[condition] DROP CONSTRAINT ukRuleCondtitionPriority
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'isEnabled' AND Object_ID = OBJECT_ID(N'rule.condition'))
BEGIN
    ALTER TABLE [rule].[condition] ADD [isEnabled] BIT NOT NULL DEFAULT(1)
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'isEnabled' AND Object_ID = OBJECT_ID(N'rule.conditionUnapproved'))
BEGIN
    ALTER TABLE [rule].[conditionUnapproved] ADD [isEnabled] BIT NOT NULL DEFAULT(1)
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'status' AND Object_ID = OBJECT_ID(N'rule.splitRangeUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitRangeUnapproved] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'status' AND Object_ID = OBJECT_ID(N'rule.splitAssignmentUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitAssignmentUnapproved] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'status' AND Object_ID = OBJECT_ID(N'rule.limitUnapproved'))
BEGIN
    ALTER TABLE [rule].[limitUnapproved] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'status' AND Object_ID = OBJECT_ID(N'rule.splitAnalyticUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitAnalyticUnapproved] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE NAME = N'status' AND Object_ID = OBJECT_ID(N'rule.splitNameUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitNameUnapproved] ADD [status] VARCHAR(20) NULL DEFAULT('pending')
END

IF EXISTS(SELECT * FROM sys.columns WHERE NAME = N'debit' AND Object_ID = OBJECT_ID(N'rule.splitAssignment'))
BEGIN
    ALTER TABLE [rule].[splitAssignment] ALTER COLUMN [debit] VARCHAR(50) NULL
END

IF EXISTS(SELECT * FROM sys.columns WHERE NAME = N'credit' AND Object_ID = OBJECT_ID(N'rule.splitAssignment'))
BEGIN
    ALTER TABLE [rule].[splitAssignment] ALTER COLUMN [credit] VARCHAR(50) NULL
END

IF EXISTS(SELECT * FROM sys.columns WHERE NAME = N'debit' AND Object_ID = OBJECT_ID(N'rule.splitAssignmentUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitAssignmentUnapproved] ALTER COLUMN [debit] VARCHAR(50) NULL
END

IF EXISTS(SELECT * FROM sys.columns WHERE NAME = N'credit' AND Object_ID = OBJECT_ID(N'rule.splitAssignmentUnapproved'))
BEGIN
    ALTER TABLE [rule].[splitAssignmentUnapproved] ALTER COLUMN [credit] VARCHAR(50) NULL
END

-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleSplitassignmentHistory] ALTER COLUMN [debit] VARCHAR(50) NULL
-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleSplitassignmentHistory] ALTER COLUMN [credit] VARCHAR(50) NULL
-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleConditionHistory] ADD [isEnabled] BIT NOT NULL DEFAULT(1)
-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleConditionunapprovedHistory] ADD [isEnabled] BIT NOT NULL DEFAULT(1)
-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleSplitassignmentunapprovedHistory] ALTER COLUMN [debit] VARCHAR(50) NULL
-- ALTER TABLE [${utHistory.db.connection.database}].[history].[ruleSplitassignmentunapprovedHistory] ALTER COLUMN [credit] VARCHAR(50) NULL
