CREATE TYPE [rule].[rateCustom] AS TABLE (
    conditionName NVARCHAR(100),
    targetCurrency VARCHAR(3),
    startAmount MONEY,
    startAmountCurrency VARCHAR(3),
    startAmountDaily MONEY,
    startCountDaily BIGINT,
    startAmountWeekly MONEY,
    startCountWeekly BIGINT,
    startAmountMonthly MONEY,
    startCountMonthly BIGINT,
    rate DECIMAL(28, 14)
)
