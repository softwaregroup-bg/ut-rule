CREATE TYPE [rule].[conditionItemCustom] AS TABLE (
    conditionName NVARCHAR(100),
    factor CHAR(2) NULL,
    itemNameId BIGINT NULL
)
