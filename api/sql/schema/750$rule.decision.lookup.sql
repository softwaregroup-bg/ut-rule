ALTER PROCEDURE [rule].[decision.lookup]
    @channelId BIGINT,
    @operation varchar(100),
    @operationDate datetime,
    @sourceAccount varchar(100),
    @sourceCardProductId BIGINT = NULL,
    @destinationAccount varchar(100),
    @amount money,
    @currency varchar(3),
    @isSourceAmount BIT=0,
    @sourceAccountOwnerId BIGINT = NULL,
    @destinationAccountOwnerId BIGINT = NULL,
    @channelType varchar(100) = NULL
AS
BEGIN
    DECLARE
        @channelCountryId BIGINT,
        @channelRegionId BIGINT,
        @channelCityId BIGINT,
        @channelTypeId BIGINT,

        @operationId BIGINT,

        @sourceCountryId BIGINT,
        @sourceRegionId BIGINT,
        @sourceCityId BIGINT,
        @sourceOwnerId BIGINT,
        @sourceAccountProductId BIGINT,
        @sourceAccountId NVARCHAR(255),

        @destinationCountryId BIGINT,
        @destinationRegionId BIGINT,
        @destinationCityId BIGINT,
        @destinationOwnerId BIGINT,
        @destinationAccountProductId BIGINT,
        @destinationAccountId NVARCHAR(255),

        @totals [rule].totals

    SELECT
        @channelCountryId = countryId,
        @channelRegionId = regionId,
        @channelCityId = cityId
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
        @channelTypeId = n.itemNameId
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'channelType'
    WHERE
        itemCode = @channelType

    SELECT
        @sourceCountryId = countryId,
        @sourceRegionId = regionId,
        @sourceCityId = cityId,
        @sourceOwnerId = ownerId,
        @sourceAccountProductId = accountProductId,
        @sourceAccountId = accountId
    FROM
        [integration].[vAccount]
    WHERE
        accountNumber = @sourceAccount AND
        (ownerId = @sourceAccountOwnerId OR @sourceAccountOwnerId IS NULL)

    SELECT
        @destinationCountryId = countryId,
        @destinationRegionId = regionId,
        @destinationCityId = cityId,
        @destinationOwnerId = ownerId,
        @destinationAccountProductId = accountProductId,
        @destinationAccountId = accountId
    FROM
        [integration].[vAccount]
    WHERE
        accountNumber = @destinationAccount AND
        (ownerId = @destinationAccountOwnerId OR @destinationAccountOwnerId IS NULL)

    SELECT @operationDate = ISNULL(@operationDate, GETDATE())

    INSERT INTO
        @totals(transferTypeId, amountDaily, countDaily, amountWeekly, countWeekly, amountMonthly, countMonthly)
    SELECT -- totals by transfer type
        t.transferTypeId,
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN 1 ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN t.transferAmount ELSE 0 END), 0),--week starts on Mon
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN 1 ELSE 0 END), 0),--week starts on Mon
        ISNULL(SUM(t.transferAmount), 0),
        ISNULL(COUNT(t.transferAmount), 0)
    FROM
        [integration].[vTransfer] t
    WHERE
        t.success = 1 AND
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
    SELECT
        'co', 'channel.role' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, r.actorId
    FROM
        core.actorGraph(@channelId,'memberOf','subject') g
    CROSS APPLY
        core.actorGraph(g.actorId,'role','subject') r
    WHERE
        g.actorId <> r.actorId
    UNION SELECT
        'so', 'source.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@sourceOwnerId,'memberOf','subject') g
    UNION SELECT
        'do', 'destination.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@destinationOwnerId,'memberOf','subject') g
    UNION SELECT
        'co', 'channel.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@channelId,'memberOf','subject') g
    UNION SELECT
        'co', 'agentOf.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@channelId,'agentOf','subject') g

    INSERT INTO
        @operationProperties(factor, name, value)
    VALUES
        --channel spatial
        ('cs', 'channel.country', @channelCountryId),
        ('cs', 'channel.region', @channelRegionId),
        ('cs', 'channel.city', @channelCityId),
        ('cs', 'channel.type', @channelTypeId),
        --operation category
        ('oc', 'operation.id', @operationId),
        --source spatial
        ('ss', 'source.country', @sourceCountryId),
        ('ss', 'source.region', @sourceRegionId),
        ('ss', 'source.city', @sourceCityId),
        --source category
        ('sc', 'source.account.product', @sourceAccountProductId),
        ('sc', 'source.card.product', @sourceCardProductId),
        --destination spatial
        ('ds', 'destination.country', @destinationCountryId),
        ('ds', 'destination.region', @destinationRegionId),
        ('ds', 'destination.city', @destinationCityId),
        --destination category
        ('dc', 'destination.account.product', @destinationAccountProductId)

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
