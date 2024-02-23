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
IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'name' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [name] NVARCHAR(100)

    IF EXISTS (SELECT * FROM sys.objects WHERE Object_ID = OBJECT_ID(N'externalHistory.ruleConditionHistory') AND TYPE = 'SN')
    BEGIN
        DECLARE @historyDB SYSNAME = (SELECT DB_NAME(DB_ID(PARSENAME(base_object_name, 3))) FROM sys.synonyms WHERE name = 'ruleConditionHistory')
        DECLARE @alter_history_table NVARCHAR(MAX) = 'IF NOT EXISTS (SELECT *
                FROM [{DBNAME}].sys.columns c
                JOIN [{DBNAME}].sys.tables t ON c.object_id = t.object_id
                JOIN [{DBNAME}].sys.schemas s ON t.schema_id = s.schema_id
                WHERE s.name = ''history''
                    AND t.name = ''ruleConditionHistory''
                    AND c.name = ''name''
            ) BEGIN
        '
        SET @alter_history_table += ' ALTER TABLE [{DBNAME}].[history].[ruleConditionHistory] ADD [name] NVARCHAR(100)'
        SET @alter_history_table += ' END'
        SET @alter_history_table = REPLACE(@alter_history_table, '{DBNAME}', @historyDB)
        EXEC(@alter_history_table)
        SET @alter_history_table = ' UPDATE [{DBNAME}].[history].[ruleConditionHistory] SET [name] = ''Rule '' + CAST(conditionId AS VARCHAR(20)) WHERE [name] IS NULL'
        SET @alter_history_table = REPLACE(@alter_history_table, '{DBNAME}', @historyDB)
        EXEC(@alter_history_table)
    END
END

IF NOT EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleConditionName' )
BEGIN
    DECLARE @updateName NVARCHAR(MAX) = 'UPDATE [rule].[condition] SET [name] = ''Rule '' + CAST(conditionId AS VARCHAR(20)) WHERE [name] IS NULL'
    EXEC(@updateName)
    ALTER TABLE [rule].[condition] ALTER COLUMN [name] NVARCHAR(100) NOT NULL
    ALTER TABLE [rule].[condition] ADD CONSTRAINT [ukRuleConditionName] UNIQUE ([name])
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'description' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [description] NVARCHAR(100)
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'notes' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD notes NVARCHAR(1000)
END

IF NOT EXISTS (SELECT *
    FROM sys.index_columns ic
    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
    JOIN sys.tables t ON i.object_id = t.object_id
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE i.is_primary_key = 1
    AND s.name = 'rule'
    AND t.name = 'conditionProperty'
    AND c.name = 'value'
) BEGIN
    ALTER TABLE [rule].[conditionProperty] DROP CONSTRAINT pkRuleConditionProperty
    ALTER TABLE [rule].[conditionProperty] ADD CONSTRAINT pkRuleConditionProperty PRIMARY KEY CLUSTERED (conditionId, factor, [name], [value])
END

IF EXISTS (SELECT * FROM sys.objects WHERE Object_ID = OBJECT_ID(N'externalHistory.ruleConditionpropertyHistory') AND TYPE = 'SN')
BEGIN
    DECLARE @alter_table NVARCHAR(MAX) = REPLACE('
        IF NOT EXISTS (SELECT *
            FROM [{DBNAME}].sys.index_columns ic
            JOIN [{DBNAME}].sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
            JOIN [{DBNAME}].sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
            JOIN [{DBNAME}].sys.tables t ON i.object_id = t.object_id
            JOIN [{DBNAME}].sys.schemas s ON t.schema_id = s.schema_id
            WHERE i.is_unique_constraint = 1
            AND s.name = ''history''
            AND t.name = ''ruleConditionpropertyHistory''
            AND c.name = ''value''
        ) BEGIN
            IF OBJECT_ID(''[{DBNAME}].[history].[ukruleconditionProperty_h_conditionId_factor_name]'') IS NOT NULL
                ALTER TABLE [{DBNAME}].[history].[ruleConditionpropertyHistory] DROP CONSTRAINT ukruleconditionProperty_h_conditionId_factor_name
            ALTER TABLE [{DBNAME}].[history].[ruleConditionpropertyHistory] ADD CONSTRAINT ukruleconditionProperty_h_conditionId_factor_name_value UNIQUE NONCLUSTERED (conditionId, factor, [name], [value], [auditEndDate], [endTransactionId])
        END
    ', '{DBNAME}', (
        SELECT DB_NAME(DB_ID(PARSENAME(base_object_name, 3)))
        FROM sys.synonyms
        WHERE name = 'ruleConditionpropertyHistory'
    ))
    EXECUTE (@alter_table)
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ccRuleConditionProperty_factor')
BEGIN
    ALTER TABLE [rule].[conditionProperty] DROP CONSTRAINT ccRuleConditionProperty_factor
    ALTER TABLE [rule].[conditionProperty] ADD CONSTRAINT ccRuleConditionProperty_factor2 CHECK (factor IN ('so', 'do', 'co', 'ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sk', 'st', 'dk', 'dt', 'tp'))
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ccRuleConditionProperty_factor1')
BEGIN
    ALTER TABLE [rule].[conditionProperty] DROP CONSTRAINT ccRuleConditionProperty_factor1
    ALTER TABLE [rule].[conditionProperty] ADD CONSTRAINT ccRuleConditionProperty_factor2 CHECK (factor IN ('so', 'do', 'co', 'ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sk', 'st', 'dk', 'dt', 'tp'))
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'amountType' AND OBJECT_ID = OBJECT_ID(N'rule.splitName') )
BEGIN
    ALTER TABLE [rule].[splitName] ADD [amountType] SMALLINT NULL
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ccRuleConditionItem_factor')
BEGIN
    ALTER TABLE [rule].[conditionItem] DROP CONSTRAINT [ccRuleConditionItem_factor]
    ALTER TABLE [rule].[conditionItem] ADD CONSTRAINT ccRuleConditionItem_factor1 CHECK (factor IN ('dc', 'sc', 'oc', 'cs', 'ds', 'ss', 'sp', 'dp'))
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'quantity' AND OBJECT_ID = OBJECT_ID(N'rule.splitAssignment') )
BEGIN
    ALTER TABLE [rule].[splitAssignment] ADD [quantity] VARCHAR(50) NULL
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'decision' AND OBJECT_ID = OBJECT_ID(N'rule.condition') )
BEGIN
    ALTER TABLE [rule].[condition] ADD [decision] XML

    IF EXISTS (SELECT * FROM sys.objects WHERE Object_ID = OBJECT_ID(N'externalHistory.ruleConditionHistory') AND TYPE = 'SN')
    BEGIN
        DECLARE @historyDB1 SYSNAME = (SELECT DB_NAME(DB_ID(PARSENAME(base_object_name, 3))) FROM sys.synonyms WHERE name = 'ruleConditionHistory')
        DECLARE @alter_history_table1 NVARCHAR(MAX) = 'IF NOT EXISTS (SELECT *
                FROM [{DBNAME}].sys.columns c
                JOIN [{DBNAME}].sys.tables t ON c.object_id = t.object_id
                JOIN [{DBNAME}].sys.schemas s ON t.schema_id = s.schema_id
                WHERE s.name = ''history''
                    AND t.name = ''ruleConditionHistory''
                    AND c.name = ''decision''
            ) BEGIN
        '
        SET @alter_history_table1 += ' ALTER TABLE [{DBNAME}].[history].[ruleConditionHistory] ADD [decision] XML'
        SET @alter_history_table1 += ' END'
        SET @alter_history_table1 = REPLACE(@alter_history_table1, '{DBNAME}', @historyDB1)
        EXEC(@alter_history_table1)
    END
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionCurrencyPriority' )
BEGIN
    ALTER TABLE [rule].[limit] DROP CONSTRAINT ukRuleLimitConditionCurrencyPriority
END

IF EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionCurrencyCredentials' )
BEGIN
    ALTER TABLE [rule].[limit] DROP CONSTRAINT ukRuleLimitConditionCurrencyCredentials
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'amountType' AND Object_ID = OBJECT_ID(N'rule.limit') )
BEGIN
    ALTER TABLE [rule].[limit] ADD amountType SMALLINT NULL
END

IF NOT EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionAmountCurrencyPriority' )
BEGIN
    ALTER TABLE [rule].[limit] ADD CONSTRAINT ukRuleLimitConditionAmountCurrencyPriority UNIQUE (conditionId, amountType, currency, [priority])
END

IF NOT EXISTS( SELECT 1 FROM sys.objects WHERE Name = N'ukRuleLimitConditionAmountCurrencyCredentials' )
BEGIN
    ALTER TABLE [rule].[limit] ADD CONSTRAINT ukRuleLimitConditionAmountCurrencyCredentials UNIQUE (conditionId, amountType, currency, [credentials])
END
