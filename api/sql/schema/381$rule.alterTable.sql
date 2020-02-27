IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'debitTenantId' AND Object_ID = OBJECT_ID(N'rule.splitAssignment') )
BEGIN
    ALTER TABLE [rule].splitAssignment ADD debitTenantId BIGINT
END

IF NOT EXISTS( SELECT 1 FROM sys.columns WHERE Name = N'creditTenantId' AND Object_ID = OBJECT_ID(N'rule.splitAssignment') )
BEGIN
    ALTER TABLE [rule].splitAssignment ADD creditTenantId BIGINT
END
