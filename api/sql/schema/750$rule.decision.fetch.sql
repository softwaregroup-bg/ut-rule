ALTER PROCEDURE [rule].[decision.fetch]
	@channelCountryId BIGINT
	,@channelRegionId BIGINT
	,@channelCityId BIGINT
	,@channelOrganizationId BIGINT
	,@channelSupervisorId BIGINT
	,@channelTags VARCHAR(255)
	,@channelRoleId BIGINT
	,@channelId BIGINT
	,@operationId BIGINT
	,@operationTags VARCHAR(255)
	,@operationDate DATETIME2(0)
	,@sourceCountryId BIGINT
	,@sourceRegionId BIGINT
	,@sourceCityId BIGINT
	,@sourceOrganizationId BIGINT
	,@sourceSupervisorId BIGINT
	,@sourceTags VARCHAR(255)
	,@sourceId BIGINT
	,@sourceProductId BIGINT
	,@sourceAccountId BIGINT
	,@destinationCountryId BIGINT
	,@destinationRegionId BIGINT
	,@destinationCityId BIGINT
	,@destinationOrganizationId BIGINT
	,@destinationSupervisorId BIGINT
	,@destinationTags VARCHAR(255)
	,@destinationId BIGINT
	,@destinationProductId BIGINT
	,@destinationAccountId BIGINT
	,@amount NUMERIC(20, 2)
	,@currency NVARCHAR(3)
	,@isSourceAmount BIT
AS
BEGIN
	IF OBJECT_ID('tempdb..#matches') IS NOT NULL
		/*Then it exists*/
		DROP TABLE #matches

	DECLARE @fee TABLE (
		minValue NUMERIC(20, 2)
		,maxValue NUMERIC(20, 2)
		,percentAmount NUMERIC(20, 2)
		)
	DECLARE @commission TABLE (
		minValue NUMERIC(20, 2)
		,maxValue NUMERIC(20, 2)
		,percentAmount NUMERIC(20, 2)
		)

	CREATE TABLE #matches (
		priority INT
		,conditionId BIGINT
		)

	INSERT INTO #matches
	SELECT [priority]
		,conditionId
	FROM [rule].condition c
    WHERE
        (@channelCountryId IS NULL OR c.channelCountryId IS NULL OR @channelCountryId = c.channelCountryId) AND
        (@channelRegionId IS NULL OR c.channelRegionId IS NULL OR @channelRegionId = c.channelRegionId) AND
        (@channelCityId IS NULL OR c.channelCityId IS NULL OR @channelCityId = c.channelCityId) AND
        (@channelOrganizationId IS NULL OR c.channelOrganizationId IS NULL OR @channelOrganizationId = c.channelOrganizationId) AND
        (@channelSupervisorId IS NULL OR c.channelSupervisorId IS NULL OR @channelSupervisorId = c.channelSupervisorId) AND
        (@channelTags IS NULL OR c.channelTag IS NULL OR @channelTags LIKE ('%|' + c.channelTag + '|%')) AND
        (@channelRoleId IS NULL OR c.channelRoleId IS NULL OR @channelRoleId = c.channelRoleId) AND
        (@channelId IS NULL OR c.channelId IS NULL OR @channelId = c.channelId) AND
        (@operationId IS NULL OR c.operationId IS NULL OR @operationId = c.operationId) AND
        (@operationTags IS NULL OR c.operationTag IS NULL OR @operationTags LIKE ('%|' + c.operationTag + '|%')) AND
        (@operationDate IS NULL OR c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (@operationDate IS NULL OR c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate)) AND
        (@sourceCountryId IS NULL OR c.sourceCountryId IS NULL OR @sourceCountryId = c.sourceCountryId) AND
        (@sourceRegionId IS NULL OR c.sourceRegionId IS NULL OR @sourceRegionId = c.sourceRegionId) AND
        (@sourceCityId IS NULL OR c.sourceCityId IS NULL OR @sourceCityId = c.sourceCityId) AND
        (@sourceOrganizationId IS NULL OR c.sourceOrganizationId IS NULL OR @sourceOrganizationId = c.sourceOrganizationId) AND
        (@sourceSupervisorId IS NULL OR c.sourceSupervisorId IS NULL OR @sourceSupervisorId = c.sourceSupervisorId) AND
        (@sourceTags IS NULL OR c.sourceTag IS NULL OR @sourceTags LIKE ('%|' + c.sourceTag + '|%')) AND
        (@sourceId IS NULL OR c.sourceId IS NULL OR @sourceId = c.sourceId) AND
        (@sourceProductId IS NULL OR c.sourceProductId IS NULL OR @sourceProductId = c.sourceProductId) AND
        (@sourceAccountId IS NULL OR c.sourceAccountId IS NULL OR @sourceAccountId = c.sourceAccountId) AND
        (@destinationCountryId IS NULL OR c.destinationCountryId IS NULL OR @destinationCountryId = c.destinationCountryId) AND
        (@destinationRegionId IS NULL OR c.destinationRegionId IS NULL OR @destinationRegionId = c.destinationRegionId) AND
        (@destinationCityId IS NULL OR c.destinationCityId IS NULL OR @destinationCityId = c.destinationCityId) AND
        (@destinationOrganizationId IS NULL OR c.destinationOrganizationId IS NULL OR @destinationOrganizationId = c.destinationOrganizationId) AND
        (@destinationSupervisorId IS NULL OR c.destinationSupervisorId IS NULL OR @destinationSupervisorId = c.destinationSupervisorId) AND
        (@destinationTags IS NULL OR c.destinationTag IS NULL OR @destinationTags LIKE ('%|' + c.destinationTag + '|%')) AND
        (@destinationId IS NULL OR c.destinationId IS NULL OR @destinationId = c.destinationId) AND
        (@destinationProductId IS NULL OR c.destinationProductId IS NULL OR @destinationProductId = c.destinationProductId) AND
        (@destinationAccountId IS NULL OR c.destinationAccountId IS NULL OR @destinationAccountId = c.destinationAccountId)

	SELECT 'limit' AS resultSetName, 1 AS single

	SELECT TOP 1 l.minAmount
		,l.maxAmount
		,l.maxCountDaily AS count
	FROM #matches AS c
	JOIN [rule].limit AS l ON l.conditionId = c.conditionId
	WHERE l.currency = @currency
	ORDER BY c.priority
		,l.limitId

	INSERT INTO @fee
	SELECT TOP 1 f.minValue
		,f.maxValue
		,COALESCE(f.[percent], CAST(0 AS FLOAT)) * (
			CASE
				WHEN @amount > f.percentBase
					THEN @amount
				ELSE f.percentBase
				END - COALESCE(f.percentBase, 0)
			) / 100 percentAmount
	FROM #matches AS c
	JOIN [rule].fee AS f ON f.conditionId = c.conditionId
	WHERE @currency = f.startAmountCurrency
		AND COALESCE(@isSourceAmount, TRUE) = f.isSourceAmount
		AND @amount >= f.startAmount
	ORDER BY c.priority
		,f.startAmount DESC
		,f.feeId

	SELECT 'fee' AS resultSetName, 1 AS single

	SELECT CASE
			WHEN r.maxValue < greatestValue
				THEN r.maxValue
			ELSE greatestValue
			END amount
	FROM (
		SELECT CASE
				WHEN f.minValue > percentAmount
					THEN f.minValue
				ELSE percentAmount
				END greatestValue
			,f.maxValue
		FROM @fee f
		) r

	INSERT INTO @commission
	SELECT TOP 1 com.minValue
		,com.maxValue
		,COALESCE(com.[percent], CAST(0 AS FLOAT)) * (
			CASE
				WHEN @amount > com.percentBase
					THEN @amount
				ELSE com.percentBase
				END - COALESCE(com.percentBase, 0)
			) / 100 percentAmount
	FROM #matches AS c
	JOIN [rule].commission AS com ON com."conditionId" = c."conditionId"
	WHERE @currency = com.startAmountCurrency
		AND COALESCE(@isSourceAmount, TRUE) = com.isSourceAmount
		AND @amount >= com.startAmount
	ORDER BY c.priority
		,com.startAmount DESC
		,com.commissionId

	SELECT 'commission' AS resultSetName, 1 AS single

	SELECT CASE
			WHEN r.maxValue < r.greatestValue
				THEN r.maxValue
			ELSE r.greatestValue
			END amount
	FROM (
		SELECT CASE
				WHEN com.minValue > com.percentAmount
					THEN com.minValue
				ELSE com.percentAmount
				END greatestValue
			,com.maxValue
		FROM @commission com
		) r
END