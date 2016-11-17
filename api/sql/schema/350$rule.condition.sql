ALTER TABLE [rule].[condition] (
	conditionId INT IDENTITY(1, 1) NOT NULL
	,[priority] INT
	,channelCountryId BIGINT
	,channelRegionId BIGINT
	,channelCityId BIGINT
	,channelOrganizationId BIGINT
	,channelSupervisorId BIGINT
	,channelTag NVARCHAR(255)
	,channelRoleId BIGINT
	,channelId BIGINT
	,operationId BIGINT
	,operationTag NVARCHAR(255)
	,operationStartDate DATETIME2(7)
	,operationEndDate DATETIME2(7)
	,sourceCountryId BIGINT
	,sourceRegionId BIGINT
	,sourceCityId BIGINT
	,sourceOrganizationId BIGINT
	,sourceSupervisorId BIGINT
	,sourceTag NVARCHAR(255)
	,sourceId BIGINT
	,sourceProductId BIGINT
	,sourceAccountId BIGINT
	,destinationCountryId BIGINT
	,destinationRegionId BIGINT
	,destinationCityId BIGINT
	,destinationOrganizationId BIGINT
	,destinationSupervisorId BIGINT
	,destinationTag NVARCHAR(255)
	,destinationId BIGINT
	,destinationProductId BIGINT
	,destinationAccountId BIGINT
	,CONSTRAINT [pkRuleCondition] PRIMARY KEY CLUSTERED ([conditionId] ASC)
)