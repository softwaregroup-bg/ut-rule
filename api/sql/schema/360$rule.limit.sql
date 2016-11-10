ALTER TABLE [rule].[limit] (
	limitId INT IDENTITY(1, 1) NOT NULL
	,conditionId INT NOT NULL
	,currency NVARCHAR(3) NOT NULL
	,minAmount NUMERIC(20, 2)
	,maxAmount NUMERIC(20, 2)
	,maxAmountDaily NUMERIC(20, 2)
	,maxCountDaily BIGINT
	,maxAmountWeekly NUMERIC(20, 2)
	,maxCountWeekly BIGINT
	,maxAmountMonthly NUMERIC(20, 2)
	,maxCountMonthly BIGINT
	,CONSTRAINT [pkRuleLimit] PRIMARY KEY CLUSTERED (limitId ASC)
	,CONSTRAINT [fkRuleLimit_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)