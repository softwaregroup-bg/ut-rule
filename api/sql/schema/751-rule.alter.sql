IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.condition')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[condition]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[condition]
        WITH CHECK ADD CONSTRAINT [fk_condition_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.conditionActor')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[conditionActor]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[conditionActor]
        WITH CHECK ADD CONSTRAINT [fk_conditionActor_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.conditionItem')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[conditionItem]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[conditionItem]
        WITH CHECK ADD CONSTRAINT [fk_conditionItem_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.conditionProperty')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[conditionProperty]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[conditionProperty]
        WITH CHECK ADD CONSTRAINT [fk_conditionProperty_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.limit')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[limit]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[limit]
        WITH CHECK ADD CONSTRAINT [fk_limit_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.splitName')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[splitName]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[splitName]
        WITH CHECK ADD CONSTRAINT [fk_splitName_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.splitAssignment')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[splitAssignment]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[splitAssignment]
        WITH CHECK ADD CONSTRAINT [fk_splitAssignment_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.splitRange')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[splitRange]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[splitRange]
        WITH CHECK ADD CONSTRAINT [fk_splitRange_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'status' AND OBJECT_ID = OBJECT_ID(N'rule.splitAnalytic')) -- add column if it does not exist
    BEGIN
        ALTER TABLE [rule].[splitAnalytic]
        ADD status VARCHAR(20) NULL DEFAULT('pending')

        ALTER TABLE [rule].[splitAnalytic]
        WITH CHECK ADD CONSTRAINT [fk_splitAnalytic_status] FOREIGN KEY ([status])
        REFERENCES [core].[status] ([statusId])
    END
