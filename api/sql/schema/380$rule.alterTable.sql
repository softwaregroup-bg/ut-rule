IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'isMaskChecked' AND Object_ID = Object_ID(N'rule.limit') )
BEGIN
    ALTER TABLE [rule].[limit] ADD isMaskChecked BIT NOT NULL DEFAULT(0)
END