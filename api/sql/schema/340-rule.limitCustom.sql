CREATE TYPE [rule].[limitCustom] AS TABLE (
    conditionName NVARCHAR(100),
    currency VARCHAR(3),
    minAmount MONEY,
    maxAmount MONEY,
    maxAmountDaily MONEY,
    maxCountDaily BIGINT,
    maxAmountWeekly MONEY,
    maxCountWeekly BIGINT,
    maxAmountMonthly MONEY,
    maxCountMonthly BIGINT,
    [credentials] INT,
    priority SMALLINT
)
