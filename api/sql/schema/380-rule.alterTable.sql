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

IF EXISTS(SELECT 1 FROM sys.columns c JOIN sys.types y ON y.user_type_id = c.user_type_id WHERE c.Name = N'percent' AND c.scale = 2 AND OBJECT_ID = OBJECT_ID(N'rule.splitAssignment'))
BEGIN
    ALTER TABLE [rule].[splitAssignment] ALTER COLUMN [percent] DECIMAL(9, 5)
END
