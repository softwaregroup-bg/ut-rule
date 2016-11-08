CREATE TABLE [rule].[limit] (
	"limitId" INT IDENTITY(1, 1) NOT NULL
	,"conditionId" INT NOT NULL
	,"currency" CHAR(3) NOT NULL
	,"minAmount" NUMERIC(20, 2)
	,"maxAmount" NUMERIC(20, 2)
	,"maxAmountDaily" NUMERIC(20, 2)
	,"maxCountDaily" BIGINT
	,"maxAmountWeekly" NUMERIC(20, 2)
	,"maxCountWeekly" BIGINT
	,"maxAmountMonthly" NUMERIC(20, 2)
	,"maxCountMonthly" BIGINT
	,CONSTRAINT "pkRuleLimit" PRIMARY KEY CLUSTERED ("limitId" ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	)
GO

ALTER TABLE [rule].[limit]
	WITH CHECK ADD CONSTRAINT "fkRuleLimit_condition" FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
GO

ALTER TABLE [rule].[limit] CHECK CONSTRAINT "fkRuleLimit_condition"