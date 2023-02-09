CREATE TYPE [rule].[matches] AS TABLE(
    [priority] INT,
    [name] NVARCHAR(100),
    conditionId BIGINT,
    amountDaily MONEY,
    countDaily BIGINT,
    amountWeekly MONEY,
    countWeekly BIGINT,
    amountMonthly MONEY,
    countMonthly BIGINT
)
