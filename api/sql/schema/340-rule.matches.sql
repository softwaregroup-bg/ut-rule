CREATE TYPE [rule].[matches] AS TABLE(
    [priority] INT,
    [name] NVARCHAR(100),
    conditionId BIGINT,
    amountDaily money,
    countDaily BIGINT,
    amountWeekly money,
    countWeekly BIGINT,
    amountMonthly money,
    countMonthly BIGINT
)
