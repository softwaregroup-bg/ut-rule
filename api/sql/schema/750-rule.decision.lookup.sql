ALTER PROCEDURE [rule].[decision.lookup]
    @channelId BIGINT, -- the id of the channel triggering transaction
    @operation VARCHAR(100), -- the operation name
    @operationDate datetime, -- the date when operation is triggered
    @sourceAccount VARCHAR(100), -- source account number
    @sourceCardProductId BIGINT = NULL, -- product id of the card
    @destinationAccount VARCHAR(100), -- destination account number
    @amount VARCHAR(21), -- operation amount
    @settlementAmount VARCHAR(21), -- operation amount
    @accountAmount VARCHAR(21), -- operation amount
    @currency VARCHAR(3), -- operation currency
    @settlementCurrency VARCHAR(3) = NULL, -- settlement currency
    @accountCurrency VARCHAR(3) = NULL, -- source account currency
    @isSourceAmount BIT = 0,
    @sourceAccountOwnerId BIGINT = NULL, -- the source account owner id
    @destinationAccountOwnerId BIGINT = NULL, -- the destination account owner id
    @credentials INT = NULL, -- the passed credentials to validate operation success
    @timeDifference INT = NULL, -- what is the difference (in minutes) with UTC, if it is not passed use server time
    @isTransactionValidate BIT = 0, -- flag showing if operation is only validated (1) or executed (0)
    @transferProperties [rule].[properties] READONLY
AS
BEGIN
    DECLARE
        @channelCountryId BIGINT,
        @channelRegionId BIGINT,
        @channelCityId BIGINT,

        @operationId BIGINT,

        @sourceCountryId BIGINT,
        @sourceRegionId BIGINT,
        @sourceCityId BIGINT,
        @sourceOwnerId BIGINT,
        @sourceAccountProductId BIGINT,
        @sourceAccountId NVARCHAR(255),
        @sourceAccountCheckAmount MONEY,
        @sourceAccountCheckMask INT,
        @sourceProductCheckAmount MONEY,
        @sourceProductCheckMask INT,
        @maxAmountParam MONEY,
        @credentialsCheck INT,

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
        @sourceCountryId = countryId,
        @sourceRegionId = regionId,
        @sourceCityId = cityId,
        @sourceOwnerId = ownerId,
        @sourceAccountProductId = accountProductId,
        @sourceAccountId = accountId,
        @sourceAccountCheckAmount = accountCheckAmount,
        @sourceAccountCheckMask = accountCheckMask,
        @sourceProductCheckAmount = productCheckAmount,
        @sourceProductCheckMask = productCheckMask
    FROM
        [integration].[vAccount]
    WHERE
        (accountNumber = @sourceAccount OR @sourceAccount IS NULL) AND
        (ownerId = @sourceAccountOwnerId OR @sourceAccountOwnerId IS NULL) AND
        (@sourceAccountOwnerId IS NOT NULL OR @sourceAccount IS NOT NULL)

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
        (accountNumber = @destinationAccount OR @destinationAccount IS NULL) AND
        (ownerId = @destinationAccountOwnerId OR @destinationAccountOwnerId IS NULL) AND
        (@destinationAccountOwnerId IS NOT NULL OR @destinationAccount IS NOT NULL)

    -- if check amount has been setup for the account and/or the account product, assign the value to variable. account is with higher priority
    SET @maxAmountParam = CASE WHEN COALESCE (@sourceAccountCheckAmount, @sourceProductCheckAmount, 0) = 0 THEN NULL ELSE ISNULL (@sourceAccountCheckAmount, @sourceProductCheckAmount) END
    -- if check credentials has been setup for the account and/or the account product, assign the value to variable. account is with higher priority
    SET @credentialsCheck = CASE WHEN COALESCE (@sourceAccountCheckMask, @sourceProductCheckMask, 0) = 0 THEN NULL ELSE ISNULL (@sourceAccountCheckMask, @sourceProductCheckMask) END

    SELECT @operationDate = ISNULL(@operationDate, GETUTCDATE())

    IF @timeDifference IS NULL
        SET @timeDifference = DATEDIFF(MINUTE, GETDATE(), GETUTCDATE())

    DECLARE @operationDateLocal DATETIME = DATEADD(MINUTE, @timeDifference, @operationDate)

    DECLARE @dailyFrom DATETIME = DATEADD(MINUTE, @timeDifference, DATEADD(DAY, DATEDIFF(DAY, 0, @operationDateLocal), 0)) -- start of the day
    DECLARE @weeklyFrom DATETIME = DATEADD(MINUTE, @timeDifference, DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDateLocal - 1), 0)) --week starts on Mon
    DECLARE @montlyFrom DATETIME = DATEADD(MINUTE, @timeDifference, DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDateLocal), 0)) -- start of the month

    INSERT INTO
        @totals(transferTypeId, amountDaily, countDaily, amountWeekly, countWeekly, amountMonthly, countMonthly)
    SELECT -- totals by transfer type
        t.transferTypeId,
        ISNULL(SUM(CASE WHEN t.transferDateTime >= @dailyFrom THEN t.transferAmount ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= @dailyFrom THEN 1 ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= @weeklyFrom THEN t.transferAmount ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= @weeklyFrom THEN 1 ELSE 0 END), 0),
        ISNULL(SUM(t.transferAmount), 0),
        ISNULL(COUNT(t.transferAmount), 0)
    FROM
        [integration].[vTransfer] t
    WHERE
        t.success = 1 AND
        t.sourceAccount = @sourceAccount AND
        t.transferCurrency = @currency AND
        t.transferDateTime < @operationDate AND -- look ony at earlier transfers
        t.transferDateTime >= @montlyFrom --look back up to the start of month
    GROUP BY
        t.transferTypeId

    DECLARE
        @operationProperties [rule].properties

    INSERT INTO
        @operationProperties(factor, name, value)
    SELECT
        'co', 'channel.role' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, r.actorId
    FROM
        core.actorGraph(@channelId, 'memberOf', 'subject') g
    CROSS APPLY
        core.actorGraph(g.actorId, 'role', 'subject') r
    WHERE
        g.actorId <> r.actorId
    UNION SELECT
        'so', 'source.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@sourceOwnerId, 'memberOf', 'subject') g
    UNION SELECT
        'do', 'destination.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@destinationOwnerId, 'memberOf', 'subject') g
    UNION SELECT
        'co', 'channel.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@channelId, 'memberOf', 'subject') g
    UNION SELECT
        'co', 'agentOf.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@channelId, 'agentOf', 'subject') g

    INSERT INTO
        @operationProperties(factor, name, value)
    VALUES
        --operation category
        ('--', 'operation.code', CONVERT(NVARCHAR, @operation)),
        ('oc', 'operation.id', CONVERT(NVARCHAR, @operationId)),
        --channel spatial
        ('cs', 'channel.country', CONVERT(NVARCHAR, @channelCountryId)),
        ('cs', 'channel.region', CONVERT(NVARCHAR, @channelRegionId)),
        ('cs', 'channel.city', CONVERT(NVARCHAR, @channelCityId)),
        --source spatial
        ('ss', 'source.country', CONVERT(NVARCHAR, @sourceCountryId)),
        ('ss', 'source.region', CONVERT(NVARCHAR, @sourceRegionId)),
        ('ss', 'source.city', CONVERT(NVARCHAR, @sourceCityId)),
        --source category
        ('sc', 'source.account.product', CONVERT(NVARCHAR, @sourceAccountProductId)),
        ('sc', 'source.card.product', CONVERT(NVARCHAR, @sourceCardProductId)),
        --destination spatial
        ('ds', 'destination.country', CONVERT(NVARCHAR, @destinationCountryId)),
        ('ds', 'destination.region', CONVERT(NVARCHAR, @destinationRegionId)),
        ('ds', 'destination.city', CONVERT(NVARCHAR, @destinationCityId)),
        --destination category
        ('dc', 'destination.account.product', CONVERT(NVARCHAR, @destinationAccountProductId))

    IF OBJECT_ID(N'customer.customer') IS NOT NULL
    BEGIN
        IF @sourceOwnerId IS NOT NULL
            INSERT INTO
                @operationProperties(factor, name, value)
            SELECT
                'sk', 'source.kyc', c.kycId
            FROM
                customer.customer c
            WHERE
                c.actorId = @sourceOwnerId
            UNION ALL SELECT
                'st', 'source.customerType', ct.customerTypeNumber
            FROM
                customer.customer c
            LEFT JOIN
                customer.customerType ct ON ct.customerTypeId = c.customerTypeId
            WHERE
                c.actorId = @sourceOwnerId
        IF @destinationOwnerId IS NOT NULL
            INSERT INTO
                @operationProperties(factor, name, value)
            SELECT
                'dk', 'destination.kyc', c.kycId
            FROM
                customer.customer c
            WHERE
                c.actorId = @destinationOwnerId
            UNION ALL SELECT
                'dt', 'destination.customerType', ct.customerTypeNumber
            FROM
                customer.customer c
            LEFT JOIN
                customer.customerType ct ON ct.customerTypeId = c.customerTypeId
            WHERE
                c.actorId = @destinationOwnerId
    END

    INSERT INTO @operationProperties(factor, name, value)
    SELECT [factor], 'transfer.' + [name], [value]
    FROM @transferProperties

    DELETE FROM @operationProperties WHERE value IS NULL

    EXEC [rule].[decision.fetch]
        @operationProperties = @operationProperties,
        @operationDate = @operationDate,
        @sourceAccountId = @sourceAccountId,
        @destinationAccountId = @destinationAccountId,
        @amountString = @amount,
        @settlementAmountString = @settlementAmount,
        @accountAmountString = @accountAmount,
        @totals = @totals,
        @currency = @currency,
        @settlementCurrency = @settlementCurrency,
        @accountCurrency = @accountCurrency,
        @isSourceAmount = @isSourceAmount,
        @sourceAccount = @sourceAccount,
        @destinationAccount = @destinationAccount,
        @maxAmountParam = @maxAmountParam,
        @credentialsCheck = @credentialsCheck,
        @credentials = @credentials,
        @isTransactionValidate = @isTransactionValidate
END
