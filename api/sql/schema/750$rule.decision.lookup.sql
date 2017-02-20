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
        @sourceCardProductId BIGINT,
        @sourceAccountProductId BIGINT,
        @sourceAccountId NVARCHAR(255),

        @destinationCountryId BIGINT,
        @destinationRegionId BIGINT,
        @destinationCityId BIGINT,
        @destinationOrganizationId BIGINT,
        @destinationSupervisorId BIGINT,
        @destinationId BIGINT,
        @destinationAccountProductId BIGINT,
        @destinationAccountId NVARCHAR(255),

        @totals [rule].totals

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

    SELECT @operationDate = ISNULL(@operationDate, GETDATE())

    INSERT INTO
        @totals(tag, amountDaily, countDaily, amountWeekly, countWeekly, amountMonthly, countMonthly)
    SELECT -- totals for that type
        NULL,
        ISNULL(SUM(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END), 0),
        ISNULL(COUNT(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END), 0),
        ISNULL(SUM(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END), 0),--week starts on Mon
        ISNULL(COUNT(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END), 0),--week starts on Mon
        ISNULL(SUM(transferAmount), 0),
        ISNULL(COUNT(transferAmount), 0)
    FROM
        [integration].[vTransfer]
    WHERE
        sourceAccount = @sourceAccount AND
        transferTypeId = @operationId AND
        transferCurrency = @currency AND
        transferDateTime < @operationDate AND -- look ony at earlier transfers
        transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate),0) --look back up to the start of month
    UNION SELECT -- totals by transfer tag
        it.tag,
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount END), 0),
        ISNULL(COUNT(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN t.transferAmount END), 0),--week starts on Mon
        ISNULL(COUNT(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN t.transferAmount END), 0),--week starts on Mon
        ISNULL(SUM(t.transferAmount), 0),
        ISNULL(COUNT(t.transferAmount), 0)
    FROM
        [integration].[vTransfer] t
    JOIN
        core.itemTag it on it.itemNameId = t.transferTypeId
    WHERE
        t.sourceAccount = @sourceAccount AND
        t.transferCurrency = @currency AND
        t.transferDateTime < @operationDate AND -- look ony at earlier transfers
        t.transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate),0) --look back up to the start of month
    GROUP BY
        it.tag

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
        @totals = @totals,
        @currency = @currency,
        @isSourceAmount = @isSourceAmount,
        @sourceAccount = @sourceAccount,
        @destinationAccount = @destinationAccount
END