CREATE TYPE [rule].[splitAssignmentCustom] AS TABLE(
    splitName VARCHAR(50),
    conditionName NVARCHAR(100),
    debit VARCHAR(50),
    credit VARCHAR(50),
    quantity VARCHAR(50),
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL(9, 2),
    [description] VARCHAR(50)
)
