CREATE TYPE [rule].[totals] AS TABLE(
    [tag] [nvarchar](50),
    amountDaily MONEY,
    countDaily BIGINT,
    amountWeekly MONEY,
    countWeekly BIGINT,
    amountMonthly MONEY,
    countMonthly BIGINT
)
