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
    ALTER TABLE [rule].[conditionProperty] ADD CONSTRAINT ccRuleConditionProperty_factor1 CHECK (factor IN ('so', 'do', 'co', 'ss', 'ds', 'cs', 'oc', 'sc', 'dc', 'sk', 'st', 'dk', 'dt'))
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'amountType' AND OBJECT_ID = OBJECT_ID(N'rule.splitName') )
BEGIN
    ALTER TABLE [rule].[splitName] ADD [amountType] SMALLINT NULL
END
