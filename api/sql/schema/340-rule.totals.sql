CREATE TYPE [rule].[totals] AS TABLE(
    transferTypeId BIGINT,
    amountDaily MONEY,
    countDaily BIGINT,
    amountWeekly MONEY,
    countWeekly BIGINT,
    amountMonthly MONEY,
    countMonthly BIGINT
)
