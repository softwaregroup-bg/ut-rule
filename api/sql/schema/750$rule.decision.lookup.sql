ALTER PROCEDURE [rule].[decision.lookup]
    @channelId BIGINT,
    @operation varchar(100),
    @operationDate datetime,
    @sourceAccount varchar(100),
    @destinationAccount varchar(100),
    @amount money,
    @currency varchar(3),
    @isSourceAmount BIT=0
AS
BEGIN
    DECLARE
        @channelCountryId BIGINT,
        @channelRegionId BIGINT,
        @channelCityId BIGINT,
        @channelOrganizationId BIGINT,
        @channelSupervisorId BIGINT,
        @channelRoleId BIGINT,

        @operationId BIGINT,

        @sourceCountryId BIGINT,
        @sourceRegionId BIGINT,
        @sourceCityId BIGINT,
        @sourceOrganizationId BIGINT,
        @sourceSupervisorId BIGINT,
        @sourceId BIGINT,
        @sourceProductId BIGINT,
        @sourceAccountId BIGINT,

        @destinationCountryId BIGINT,
        @destinationRegionId BIGINT,
        @destinationCityId BIGINT,
        @destinationOrganizationId BIGINT,
        @destinationSupervisorId BIGINT,
        @destinationId BIGINT,
        @destinationProductId BIGINT,
        @destinationAccountId BIGINT

    SELECT
        @channelCountryId = countryId,
        @channelRegionId = regionId,
        @channelCityId = cityId,
        @channelOrganizationId = organizationId,
        @channelSupervisorId = supervisorId,
        @channelRoleId = roleId
    FROM
        [integration].[vChannel]
    WHERE
        channelId = @channelId

    SELECT
        @operationId = n.itemNameId
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE
        itemCode = @operation

    SELECT
        @sourceCountryId = countryId,
        @sourceRegionId = regionId,
        @sourceCityId = cityId,
        @sourceOrganizationId = organizationId,
        @sourceSupervisorId = supervisorId,
        @sourceId = holderId,
        @sourceProductId = productId,
        @sourceAccountId = accountId
    FROM
        [integration].[vAccount]
    WHERE
        accountNumber = @sourceAccount

    SELECT
        @destinationCountryId = countryId,
        @destinationRegionId = regionId,
        @destinationCityId = cityId,
        @destinationOrganizationId = organizationId,
        @destinationSupervisorId = supervisorId,
        @destinationId = holderId,
        @destinationProductId = productId,
        @destinationAccountId = accountId
    FROM
        [integration].[vAccount]
    WHERE
        accountNumber = @destinationAccount

    EXEC [rule].[decision.fetch]
        @channelCountryId = @channelCountryId,
        @channelRegionId = @channelRegionId,
        @channelCityId = @channelCityId,
        @channelOrganizationId = @channelOrganizationId,
        @channelSupervisorId = @channelSupervisorId,
        @channelRoleId = @channelRoleId,
        @channelId = @channelId,
        @operationId = @operationId,
        @operationDate = @operationDate,
        @sourceCountryId = @sourceCountryId,
        @sourceRegionId = @sourceRegionId,
        @sourceCityId = @sourceCityId,
        @sourceOrganizationId = @sourceOrganizationId,
        @sourceSupervisorId = @sourceSupervisorId,
        @sourceId = @sourceId,
        @sourceProductId = @sourceProductId,
        @sourceAccountId = @sourceAccountId,
        @destinationCountryId = @destinationCountryId,
        @destinationRegionId = @destinationRegionId,
        @destinationCityId = @destinationCityId,
        @destinationOrganizationId = @destinationOrganizationId,
        @destinationSupervisorId = @destinationSupervisorId,
        @destinationId = @destinationId,
        @destinationProductId = @destinationProductId,
        @destinationAccountId = @destinationAccountId,
        @amount = @amount,
        @currency = @currency,
        @isSourceAmount = @isSourceAmount
END