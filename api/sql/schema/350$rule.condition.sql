CREATE TABLE [rule].[condition] (
	conditionId INT IDENTITY(1, 1) NOT NULL
	,[priority] INTEGER
	,channelCountryId BIGINT
	,channelRegionId BIGINT
	,channelCityId BIGINT
	,channelOrganizationId BIGINT
	,channelSupervisorId BIGINT
	,channelTag VARCHAR(255)
	,channelRoleId BIGINT
	,channelId BIGINT
	,operationId BIGINT
	,operationTag VARCHAR(255)
	,operationStartDate DATETIME2(0)
	,operationEndDate DATETIME2(0)
	,sourceCountryId BIGINT
	,sourceRegionId BIGINT
	,sourceCityId BIGINT
	,sourceOrganizationId BIGINT
	,sourceSupervisorId BIGINT
	,sourceTag VARCHAR(255)
	,sourceId BIGINT
	,sourceProductId BIGINT
	,sourceAccountId BIGINT
	,destinationCountryId BIGINT
	,destinationRegionId BIGINT
	,destinationCityId BIGINT
	,destinationOrganizationId BIGINT
	,destinationSupervisorId BIGINT
	,destinationTag VARCHAR(255)
	,destinationId BIGINT
	,destinationProductId BIGINT
	,destinationAccountId BIGINT
	,CONSTRAINT [pkRuleCondition] PRIMARY KEY CLUSTERED ([conditionId] ASC) WITH (
		PAD_INDEX = OFF
		,STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
		,ALLOW_ROW_LOCKS = ON
		,ALLOW_PAGE_LOCKS = ON
		) ON [PRIMARY]
	) ON [PRIMARY]