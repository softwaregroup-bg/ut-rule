CREATE TYPE [rule].[totals] AS TABLE(
    currency VARCHAR(3) NOT NULL,
    amountType SMALLINT,
    transferTypeId BIGINT,
    amountDaily MONEY,
    countDaily BIGINT,
    amountWeekly MONEY,
    countWeekly BIGINT,
    amountMonthly MONEY,
    countMonthly BIGINT
)
