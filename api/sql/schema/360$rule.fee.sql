CREATE TABLE [rule].[fee] (
	"feeId" INT IDENTITY(1, 1) NOT NULL
	,"conditionId" INTEGER NOT NULL
	,"startAmount" NUMERIC(20, 2) NOT NULL
	,"startAmountCurrency" CHAR(3) NOT NULL
	,"isSourceAmount" BIT NOT NULL
	,"minValue" NUMERIC(20, 2)
	,"maxValue" NUMERIC(20, 2)
	,"percent" NUMERIC(5, 2)
	,"percentBase" NUMERIC(20, 2)
	,CONSTRAINT "pkRuleFee" PRIMARY KEY CLUSTERED ("feeId" ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	)
GO

ALTER TABLE [rule].[fee]
	WITH CHECK ADD CONSTRAINT "fkRuleFee_condition" FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
GO

ALTER TABLE [rule].[fee] CHECK CONSTRAINT "fkRuleFee_condition"