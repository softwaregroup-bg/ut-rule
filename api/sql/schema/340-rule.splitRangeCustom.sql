CREATE TYPE [rule].[splitRangeCustom] AS TABLE (
    splitName VARCHAR(50),
    conditionName NVARCHAR(100),
    startAmount MONEY,
    startAmountCurrency VARCHAR(3),
    startAmountDaily MONEY,
    startCountDaily BIGINT,
    startAmountWeekly MONEY,
    startCountWeekly BIGINT,
    startAmountMonthly MONEY,
    startCountMonthly BIGINT,
    isSourceAmount BIT,
    minValue MONEY,
    maxValue MONEY,
    [percent] DECIMAL(9, 2),
    percentBase MONEY
)
