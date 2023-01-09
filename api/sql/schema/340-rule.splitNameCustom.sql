CREATE TYPE [rule].[splitNameCustom] AS TABLE (
    conditionName NVARCHAR(100),
    [name] VARCHAR(50),
    tag VARCHAR(255)
)
