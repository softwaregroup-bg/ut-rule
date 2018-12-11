ALTER PROCEDURE [rule].[decision.lookup]
    @channelId BIGINT,
    @operation varchar(100),
    @operationTag VARCHAR(100) = NULL,
    @operationDate datetime,
    @sourceAccount varchar(100),
    @destinationAccount varchar(100),
    @amount money,
    @currency varchar(3),
    @isSourceAmount BIT=0,
    @isSourceAccount BIT = 1
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
        @sourceCardProductId BIGINT,
        @sourceAccountProductId BIGINT,
        @sourceAccountId BIGINT,

        @destinationCountryId BIGINT,
        @destinationRegionId BIGINT,
        @destinationCityId BIGINT,
        @destinationOrganizationId BIGINT,
        @destinationSupervisorId BIGINT,
        @destinationId BIGINT,
        @destinationAccountProductId BIGINT,
        @destinationAccountId BIGINT,

        @amountDaily MONEY,
        @countDaily BIGINT,
        @amountWeekly MONEY,
        @countWeekly BIGINT,
        @amountMonthly MONEY,
        @countMonthly BIGINT,
        -- Lifetime
        @amountLifetime MONEY,
        @countLifetime BIGINT

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
        @sourceCardProductId = cardProductId,
        @sourceAccountProductId = accountProductId,
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
        @destinationAccountProductId = accountProductId,
        @destinationAccountId = accountId
    FROM
        [integration].[vAccount]
    WHERE
        accountNumber = @destinationAccount

    SELECT @amountDaily = 0,
        @countDaily = 0,
        @amountWeekly = 0,
        @countWeekly = 0,
        @amountMonthly = 0,
        @countMonthly = 0,
        -- Lifetime
        @amountLifetime = 0,
        @countLifetime = 0,
        @operationDate = ISNULL(@operationDate, GETDATE())

    SELECT
        @amountDaily = ISNULL(SUM(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END), 0),
        @countDaily = ISNULL(COUNT(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END), 0),
        @amountWeekly = ISNULL(SUM(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END), 0),--week starts on Mon
        @countWeekly = ISNULL(COUNT(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END), 0),--week starts on Mon
        @amountMonthly = ISNULL(SUM(transferAmount), 0),
        @countMonthly = ISNULL(COUNT(transferAmount), 0)
    FROM
        [integration].[vTransfer]
    WHERE
        ( (@isSourceAccount= 1 AND sourceAccount = @sourceAccount) OR (@isSourceAccount = 0 AND channelId = @channelId) ) AND
        transferTypeId = @operationId AND
        transferCurrency = @currency AND
        transferDateTime < @operationDate AND -- look ony at earlier transfers
        transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate),0) --look back up to the start of month
        -- add cases bellow for P2P
        AND
            transferIdPrevTxn is NULL -- get only the first part of P2P txns. Also Balance Enquiries dont have prevIds
            AND issuerTxState IN (2) -- get only successful txns

    -- Lifetime
    SELECT
        @amountLifetime = ISNULL(SUM(transferAmount), 0),
        @countLifetime = ISNULL(COUNT(transferAmount), 0)
    FROM
        [integration].[vTransfer]
    WHERE
        ( (@isSourceAccount= 1 AND sourceAccount = @sourceAccount) OR (@isSourceAccount = 0 AND channelId = @channelId) ) AND
        transferTypeId = @operationId AND
        transferCurrency = @currency AND
        transferDateTime < @operationDate -- look ony at earlier transfers from the beginning
        -- add cases bellow for P2P
        AND
            transferIdPrevTxn is NULL -- get only the first part of P2P txns. Also Balance Enquiries dont have prevIds
            AND issuerTxState IN (2) -- get only successful txns


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
        @operationTag = @operationTag,
        @sourceCountryId = @sourceCountryId,
        @sourceRegionId = @sourceRegionId,
        @sourceCityId = @sourceCityId,
        @sourceOrganizationId = @sourceOrganizationId,
        @sourceSupervisorId = @sourceSupervisorId,
        @sourceId = @sourceId,
        @sourceCardProductId = @sourceCardProductId,
        @sourceAccountProductId = @sourceAccountProductId,
        @sourceAccountId = @sourceAccountId,
        @destinationCountryId = @destinationCountryId,
        @destinationRegionId = @destinationRegionId,
        @destinationCityId = @destinationCityId,
        @destinationOrganizationId = @destinationOrganizationId,
        @destinationSupervisorId = @destinationSupervisorId,
        @destinationId = @destinationId,
        @destinationAccountProductId = @destinationAccountProductId,
        @destinationAccountId = @destinationAccountId,
        @amount = @amount,
        @amountDaily = @amountDaily,
        @countDaily = @countDaily,
        @amountWeekly = @amountWeekly,
        @countWeekly = @countWeekly,
        @amountMonthly = @amountMonthly,
        @countMonthly = @countMonthly,
        -- Lifetime
        @amountLifetime = @amountLifetime,
        @countLifetime = @countLifetime,
        @currency = @currency,
        @isSourceAmount = @isSourceAmount
END