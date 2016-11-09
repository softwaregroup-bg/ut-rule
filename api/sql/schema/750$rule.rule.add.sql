ALTER PROCEDURE [rule].[rule.add] (
	@condition [rule].conditionTT READONLY
	,@fee [rule].feeTT READONLY
	,@limit [rule].limitTT READONLY
	,@commission [rule].commissionTT READONLY
	)
AS
DECLARE @conditionId INT

BEGIN TRY
	BEGIN TRANSACTION

	INSERT INTO [rule].condition (
		[priority]
		,channelCountryId
		,channelRegionId
		,channelCityId
		,channelOrganizationId
		,channelSupervisorId
		,channelTag
		,channelRoleId
		,channelId
		,operationId
		,operationTag
		,operationStartDate
		,operationEndDate
		,sourceCountryId
		,sourceRegionId
		,sourceCityId
		,sourceOrganizationId
		,sourceSupervisorId
		,sourceTag
		,sourceId
		,sourceProductId
		,sourceAccountId
		,destinationCountryId
		,destinationRegionId
		,destinationCityId
		,destinationOrganizationId
		,destinationSupervisorId
		,destinationTag
		,destinationId
		,destinationProductId
		,destinationAccountId
		)
	SELECT [priority]
		,[channelCountryId]
		,[channelRegionId]
		,[channelCityId]
		,[channelOrganizationId]
		,[channelSupervisorId]
		,[channelTag]
		,[channelRoleId]
		,[channelId]
		,[operationId]
		,[operationTag]
		,[operationStartDate]
		,[operationEndDate]
		,[sourceCountryId]
		,[sourceRegionId]
		,[sourceCityId]
		,[sourceOrganizationId]
		,[sourceSupervisorId]
		,[sourceTag]
		,[sourceId]
		,[sourceProductId]
		,[sourceAccountId]
		,[destinationCountryId]
		,[destinationRegionId]
		,[destinationCityId]
		,[destinationOrganizationId]
		,[destinationSupervisorId]
		,[destinationTag]
		,[destinationId]
		,[destinationProductId]
		,[destinationAccountId]
	FROM @condition;

	SET @conditionId = SCOPE_IDENTITY()

	INSERT INTO [rule].commission (
		conditionId
		,startAmount
		,startAmountCurrency
		,isSourceAmount
		,minValue
		,maxValue
		,[percent]
		,percentBase
		)
	SELECT @conditionId
		,[startAmount]
		,[startAmountCurrency]
		,[isSourceAmount]
		,[minValue]
		,[maxValue]
		,[percent]
		,[percentBase]
	FROM @commission;

	INSERT INTO [rule].limit (
		conditionId
		,currency
		,minAmount
		,maxAmount
		,maxAmountDaily
		,maxCountDaily
		,maxAmountWeekly
		,maxCountWeekly
		,maxAmountMonthly
		,maxCountMonthly
		)
	SELECT @conditionId
		,[currency]
		,[minAmount]
		,[maxAmount]
		,[maxAmountDaily]
		,[maxCountDaily]
		,[maxAmountWeekly]
		,[maxCountWeekly]
		,[maxAmountMonthly]
		,[maxCountMonthly]
	FROM @limit;

	INSERT INTO [rule].fee (
		conditionId
		,startAmount
		,startAmountCurrency
		,isSourceAmount
		,minValue
		,maxValue
		,[percent]
		,percentBase
		)
	SELECT @conditionId
		,[startAmount]
		,[startAmountCurrency]
		,[isSourceAmount]
		,[minValue]
		,[maxValue]
		,[percent]
		,[percentBase]
	FROM @fee

	COMMIT TRANSACTION

	EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY

BEGIN CATCH
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	SELECT 2001 errorCode
		,'SQL Error' errorMessage

	RETURN
END CATCH