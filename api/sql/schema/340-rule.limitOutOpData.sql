CREATE TYPE [rule].[limitOutOpData] AS TABLE(
    conditionId INT,
    actorId BIGINT,
    [factorLevel] INT,
    transferTypeId BIGINT,
    minAmountDaily MONEY NULL,
    maxAmountDaily MONEY NULL,
    minAmountWeekly MONEY NULL,
    maxAmountWeekly MONEY NULL,
    minAmountMonthly MONEY NULL,
    maxAmountMonthly MONEY NULL
)
