ALTER PROCEDURE [rule].[rule.edit]
	@condition [rule].conditionTT READONLY
	,@fee [rule].feeTT READONLY
	,@limit [rule].limitTT READONLY
	,@commission [rule].commissionTT READONLY
AS
BEGIN TRY
	DECLARE @conditionId INT

	SET @conditionId = (
			SELECT conditionId
			FROM @condition
			)

	BEGIN TRANSACTION

	DELETE f
	FROM [rule].fee f
	LEFT JOIN @fee f1 ON f1.feeId = f.feeId
	WHERE f.conditionId = @conditionId
		AND f1.feeId IS NULL

	DELETE c
	FROM [rule].commission c
	LEFT JOIN @commission c1 ON c.commissionId = c1.commissionId
	WHERE c.conditionId = @conditionId
		AND c1.commissionId IS NULL

	DELETE l
	FROM [rule].limit l
	LEFT JOIN @limit l1 ON l.limitId = l1.limitId
	WHERE l.conditionId = @conditionId
		AND l1.limitId IS NULL

	UPDATE c
	SET [priority] = c1.[priority]
		,channelCountryId = c1.channelCountryId
		,channelRegionId = c1.channelRegionId
		,channelCityId = c1.channelCityId
		,channelOrganizationId = c1.channelOrganizationId
		,channelSupervisorId = c1.channelSupervisorId
		,channelTag = c1.channelTag
		,channelRoleId = c1.channelRoleId
		,channelId = c1.channelId
		,operationId = c1.operationId
		,operationTag = c1.operationTag
		,operationStartDate = c1.operationStartDate
		,operationEndDate = c1.operationEndDate
		,sourceCountryId = c1.sourceCountryId
		,sourceRegionId = c1.sourceRegionId
		,sourceCityId = c1.sourceCityId
		,sourceOrganizationId = c1.sourceOrganizationId
		,sourceSupervisorId = c1.sourceSupervisorId
		,sourceTag = c1.sourceTag
		,sourceId = c1.sourceId
		,sourceProductId = c1.sourceProductId
		,sourceAccountId = c1.sourceAccountId
		,destinationCountryId = c1.destinationCountryId
		,destinationRegionId = c1.destinationRegionId
		,destinationCityId = c1.destinationCityId
		,destinationOrganizationId = c1.destinationOrganizationId
		,destinationSupervisorId = c1.destinationSupervisorId
		,destinationTag = c1.destinationTag
		,destinationId = c1.destinationId
		,destinationProductId = c1.destinationProductId
		,destinationAccountId = c1.destinationAccountId
	FROM [rule].condition c
	JOIN @condition c1 ON c.conditionId = c1.conditionId

	UPDATE c
	SET startAmount = c1.startAmount
		,startAmountCurrency = c1.startAmountCurrency
		,isSourceAmount = c1.isSourceAmount
		,minValue = c1.minValue
		,maxValue = c1.maxValue
		,[percent] = c1.[percent]
		,percentBase = c1.percentBase
	FROM [rule].commission c
	JOIN @commission c1 ON c.commissionId = c1.commissionId

	UPDATE l
	SET currency = l1.currency
		,minAmount = l1.minAmount
		,maxAmount = l1.maxAmount
		,maxAmountDaily = l1.maxAmountDaily
		,maxCountDaily = l1.maxCountDaily
		,maxAmountWeekly = l1.maxAmountWeekly
		,maxCountWeekly = l1.maxCountWeekly
		,maxAmountMonthly = l1.maxAmountMonthly
		,maxCountMonthly = l1.maxCountMonthly
	FROM [rule].limit l
	JOIN @limit l1 ON l.limitId = l1.limitId

	UPDATE f
	SET startAmount = f.startAmount
		,startAmountCurrency = f.startAmountCurrency
		,isSourceAmount = f.isSourceAmount
		,minValue = f.minValue
		,maxValue = f.maxValue
		,[percent] = f.[percent]
		,percentBase = f.percentBase
	FROM [rule].fee f
	JOIN @fee f1 ON f.feeId = f1.feeId

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
	SELECT c1.conditionId
		,c1.startAmount
		,c1.startAmountCurrency
		,c1.isSourceAmount
		,c1.minValue
		,c1.maxValue
		,c1.[percent]
		,c1.percentBase
	FROM @commission c1
	LEFT JOIN [rule].commission c ON c.commissionId = c1.commissionId
	WHERE c.commissionId IS NULL

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
	SELECT l1.conditionId
		,l1.currency
		,l1.minAmount
		,l1.maxAmount
		,l1.maxAmountDaily
		,l1.maxCountDaily
		,l1.maxAmountWeekly
		,l1.maxCountWeekly
		,l1.maxAmountMonthly
		,l1.maxCountMonthly
	FROM @limit l1
	LEFT JOIN [rule].limit l ON l.limitId = l1.limitId
	WHERE l.limitId IS NULL

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
	SELECT f1.conditionId
		,f1.startAmount
		,f1.startAmountCurrency
		,f1.isSourceAmount
		,f1.minValue
		,f1.maxValue
		,f1.[percent]
		,f1.percentBase
	FROM @fee f1
	JOIN [rule].fee f ON f.feeId = f1.feeId
	WHERE f.feeId IS NULL

	COMMIT TRANSACTION

	EXEC [rule].[rule.fetch] @conditionId = @conditionId
END TRY

BEGIN CATCH
	IF @@TRANCOUNT > 0
		ROLLBACK TRANSACTION

	EXEC core.error
    RETURN 55555
END CATCH