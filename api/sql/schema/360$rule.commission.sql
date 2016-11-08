CREATE TABLE [rule].[commission] (
	commissionId INT IDENTITY(1, 1) NOT NULL
	,conditionId INTEGER NOT NULL
	,startAmount NUMERIC(20, 2) NOT NULL
	,startAmountCurrency CHAR(3) NOT NULL
	,isSourceAmount BIT NOT NULL
	,minValue NUMERIC(20, 2)
	,maxValue NUMERIC(20, 2)
	,[percent] NUMERIC(5, 2)
	,percentBase NUMERIC(20, 2)
	,CONSTRAINT pkRuleCommission PRIMARY KEY CLUSTERED (commissionId ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	)
GO

ALTER TABLE [rule].[commission]
	WITH CHECK ADD CONSTRAINT [fkRuleCommission_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
GO

ALTER TABLE [rule].[commission] CHECK CONSTRAINT [fkRuleCommission_condition]