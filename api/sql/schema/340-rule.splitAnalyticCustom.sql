CREATE TYPE [rule].[splitAnalyticCustom] AS TABLE (
    splitAssignmentDescription VARCHAR(50),
    splitName VARCHAR(50),
    conditionName NVARCHAR(100),
    [name] VARCHAR(50) NULL,
    [value] VARCHAR(100) NULL
)
