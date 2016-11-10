ALTER TABLE [rule].[fee] (
	feeId INT IDENTITY(1, 1) NOT NULL
	,conditionId INT NOT NULL
	,startAmount NUMERIC(20, 2) NOT NULL
	,startAmountCurrency NVARCHAR(3) NOT NULL
	,isSourceAmount BIT NOT NULL
	,minValue NUMERIC(20, 2)
	,maxValue NUMERIC(20, 2)
	,[percent] NUMERIC(5, 2)
	,percentBase NUMERIC(20,2)
	,CONSTRAINT [pkRuleFee] PRIMARY KEY CLUSTERED (feeId ASC)
	,CONSTRAINT [fkRuleFee_condition] FOREIGN KEY (conditionId) REFERENCES [rule].[condition](conditionId)
)