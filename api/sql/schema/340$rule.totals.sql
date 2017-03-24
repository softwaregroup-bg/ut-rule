CREATE TYPE [rule].[totals] AS TABLE(
    transferTypeId bigint,
    amountDaily money,
    countDaily bigint,
    amountWeekly money,
    countWeekly bigint,
    amountMonthly money,
    countMonthly bigint
)
