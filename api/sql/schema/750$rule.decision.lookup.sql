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
        @totals(transferTypeId, amountDaily, countDaily, amountWeekly, countWeekly, amountMonthly, countMonthly)
    SELECT -- totals by transfer type
        t.transferTypeId,
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount END), 0),
        ISNULL(COUNT(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN t.transferAmount END), 0),--week starts on Mon
        ISNULL(COUNT(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN t.transferAmount END), 0),--week starts on Mon
        ISNULL(SUM(t.transferAmount), 0),
        ISNULL(COUNT(t.transferAmount), 0)
    FROM
        [integration].[vTransfer] t
    WHERE
        t.sourceAccount = @sourceAccount AND
        t.transferCurrency = @currency AND
        t.transferDateTime < @operationDate AND -- look ony at earlier transfers
        t.transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate),0) --look back up to the start of month
    GROUP BY
        t.transferTypeId

    DECLARE
        @operationProperties [rule].properties
    INSERT INTO
        @operationProperties(factor, name, value)
    VALUES
        --channel spatial
        ('cs', 'channel.country', @channelCountryId),
        ('cs', 'channel.region', @channelRegionId),
        ('cs', 'channel.city', @channelCityId),
        --channel organization
        ('co', 'channel.organization', @channelOrganizationId),
        ('co', 'channel.supervisor', @channelSupervisorId),
        ('co', 'channel.role', @channelRoleId),
        ('co', 'channel.id', @channelId),
        --operation category
        ('oc', 'operation.id', @operationId),
        --source spatial
        ('ss', 'source.country', @sourceCountryId),
        ('ss', 'source.region', @sourceRegionId),
        ('ss', 'source.city', @sourceCityId),
        --source organization
        ('so', 'source.organization', @sourceOrganizationId),
        ('so', 'source.supervisor', @sourceSupervisorId),
        ('so', 'source.id', @sourceId),
        --source category
        ('sc', 'source.account.productId', @sourceAccountProductId),
        ('sc', 'source.card.productId', @sourceCardProductId),
        --destination spatial
        ('ds', 'destination.country', @destinationCountryId),
        ('ds', 'destination.region', @destinationRegionId),
        ('ds', 'destination.city', @destinationCityId),
        --destination organization
        ('do', 'destination.organization', @destinationOrganizationId),
        ('do', 'destination.supervisor', @destinationSupervisorId),
        ('do', 'destination.id', @destinationId),
        --destination category
        ('dc', 'destination.account.productId', @destinationAccountProductId)

    DELETE FROM @operationProperties WHERE value IS NULL

    EXEC [rule].[decision.fetch]
        @operationProperties = @operationProperties,
        @operationDate = @operationDate,
        @sourceAccountId = @sourceAccountId,
        @destinationAccountId = @destinationAccountId,
        @amount = @amount,
        @totals = @totals,
        @currency = @currency,
        @isSourceAmount = @isSourceAmount,
        @sourceAccount = @sourceAccount,
        @destinationAccount = @destinationAccount
END