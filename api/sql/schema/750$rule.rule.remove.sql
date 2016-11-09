ALTER PROCEDURE [rule].[rule.remove]
	@condition [rule].conditionTT READONLY
AS
BEGIN TRY
	IF OBJECT_ID('tempdb..#tmpCondition') IS NOT NULL
		/*Then it exists*/
		DROP TABLE #tmpCondition

	CREATE TABLE #tmpCondition (
		[conditionId] [int] NOT NULL
		,[priority] [int] NULL
		,[channelCountryId] [bigint] NULL
		,[channelRegionId] [bigint] NULL
		,[channelCityId] [bigint] NULL
		,[channelOrganizationId] [bigint] NULL
		,[channelSupervisorId] [bigint] NULL
		,[channelTag] [varchar](255) NULL
		,[channelRoleId] [bigint] NULL
		,[channelId] [bigint] NULL
		,[operationId] [bigint] NULL
		,[operationTag] [varchar](255) NULL
		,[operationStartDate] [datetime2](7) NULL
		,[operationEndDate] [datetime2](7) NULL
		,[sourceCountryId] [bigint] NULL
		,[sourceRegionId] [bigint] NULL
		,[sourceCityId] [bigint] NULL
		,[sourceOrganizationId] [bigint] NULL
		,[sourceSupervisorId] [bigint] NULL
		,[sourceTag] [varchar](255) NULL
		,[sourceId] [bigint] NULL
		,[sourceProductId] [bigint] NULL
		,[sourceAccountId] [bigint] NULL
		,[destinationCountryId] [bigint] NULL
		,[destinationRegionId] [bigint] NULL
		,[destinationCityId] [bigint] NULL
		,[destinationOrganizationId] [bigint] NULL
		,[destinationSupervisorId] [bigint] NULL
		,[destinationTag] [varchar](255) NULL
		,[destinationId] [bigint] NULL
		,[destinationProductId] [bigint] NULL
		,[destinationAccountId] [bigint] NULL
		)

	IF OBJECT_ID('tempdb..#tmpFee') IS NOT NULL
		/*Then it exists*/
		DROP TABLE #tmpFee

	CREATE TABLE #tmpFee (
		[feeId] [int] NOT NULL
		,[conditionId] [int] NOT NULL
		,[startAmount] [numeric](20, 2) NOT NULL
		,[startAmountCurrency] [char](3) NOT NULL
		,[isSourceAmount] [bit] NOT NULL
		,[minValue] [numeric](20, 2) NULL
		,[maxValue] [numeric](20, 2) NULL
		,[percent] [numeric](5, 2) NULL
		,[percentBase] [numeric](20, 2) NULL
		)

	IF OBJECT_ID('tempdb..#tmpLimit') IS NOT NULL
		/*Then it exists*/
		DROP TABLE #tmpLimit

	CREATE TABLE #tmpLimit (
		[limitId] [int] NOT NULL
		,[conditionId] [int] NOT NULL
		,[currency] [char](3) NOT NULL
		,[minAmount] [numeric](20, 2) NULL
		,[maxAmount] [numeric](20, 2) NULL
		,[maxAmountDaily] [numeric](20, 2) NULL
		,[maxCountDaily] [bigint] NULL
		,[maxAmountWeekly] [numeric](20, 2) NULL
		,[maxCountWeekly] [bigint] NULL
		,[maxAmountMonthly] [numeric](20, 2) NULL
		,[maxCountMonthly] [bigint] NULL
		)

	IF OBJECT_ID('tempdb..#tmpCommission') IS NOT NULL
		/*Then it exists*/
		DROP TABLE #tmpCommission

	CREATE TABLE #tmpCommission (
		[commissionId] [int] NOT NULL
		,[conditionId] [int] NOT NULL
		,[startAmount] [numeric](20, 2) NOT NULL
		,[startAmountCurrency] [char](3) NOT NULL
		,[isSourceAmount] [bit] NOT NULL
		,[minValue] [numeric](20, 2) NULL
		,[maxValue] [numeric](20, 2) NULL
		,[percent] [numeric](5, 2) NULL
		,[percentBase] [numeric](20, 2) NULL
		)

	INSERT INTO #tmpCondition
	SELECT c.*
	FROM [rule].condition c
	JOIN @condition item ON c.conditionId = item.conditionId

	INSERT INTO #tmpCommission
	SELECT c.*
	FROM [rule].commission c
	JOIN @condition item ON c.conditionId = item.conditionId

	INSERT INTO #tmpFee
	SELECT f.*
	FROM [rule].fee f
	JOIN @condition item ON f.conditionId = item.conditionId

	INSERT INTO #tmpLimit
	SELECT l.*
	FROM [rule].limit l
	JOIN @condition item ON l.conditionId = item.conditionId

	BEGIN TRANSACTION

	DELETE f
	FROM [rule].fee f
	JOIN @condition item ON f.conditionId = item.conditionId

	DELETE l
	FROM [rule].limit l
	JOIN @condition item ON l.conditionId = item.conditionId

	DELETE c
	FROM [rule].commission c
	JOIN @condition item ON c.conditionId = item.conditionId

	DELETE c
	FROM [rule].condition c
	JOIN @condition item ON c.conditionId = item.conditionId

	COMMIT TRANSACTION

	SELECT 'condition' AS resultSetName

	SELECT *
	FROM #tmpCondition

	SELECT 'limit' AS resultSetName

	SELECT *
	FROM #tmpLimit

	SELECT 'commission' AS resultSetName

	SELECT *
	FROM #tmpCommission

	SELECT 'fee' AS resultSetName

	SELECT *
	FROM #tmpFee
END TRY

BEGIN CATCH
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	EXEC core.error
    RETURN 55555
END CATCH