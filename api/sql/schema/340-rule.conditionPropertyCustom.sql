CREATE TYPE [rule].[conditionPropertyCustom] AS TABLE (
    conditionName NVARCHAR(100),
    factor CHAR(2),
    [name] NVARCHAR(50),
    [value] NVARCHAR(200)
)
