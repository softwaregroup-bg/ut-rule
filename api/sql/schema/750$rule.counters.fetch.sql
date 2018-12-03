ALTER PROCEDURE [rule].[counters.fetch]
    @customerActorId BIGINT,
    @tnxOperationType varchar(100)
AS
BEGIN
    DECLARE
        @actorId BIGINT = @customerActorId,
        @operation VARCHAR(100) = @tnxOperationType,
        @operationDate DATETIME = GETDATE(),
        @channelRoleId BIGINT,
        @operationId BIGINT,

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
        @channelRoleId = roleId
    FROM
        [integration].[vChannel]
    WHERE
        channelId = @actorId

    SELECT
        @operationId = n.itemNameId
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE
        itemCode = @operation

    SELECT
        @amountDaily = 0,
        @countDaily = 0,
        @amountWeekly = 0,
        @countWeekly = 0,
        @amountMonthly = 0,
        @countMonthly = 0,
        -- Lifetime
        @amountLifetime = 0,
        @countLifetime = 0

    SELECT
        @amountDaily = SUM(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END),
        @countDaily = COUNT(CASE WHEN transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN transferAmount END),
        @amountWeekly = SUM(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END),--week starts on Mon
        @countWeekly = COUNT(CASE WHEN transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate-1), 0) THEN transferAmount END),--week starts on Mon
        @amountMonthly = SUM(transferAmount),
        @countMonthly = COUNT(transferAmount)
    FROM
        [integration].[vTransfer]
    WHERE
        channelId = @actorId AND
        transferTypeId = @operationId AND
        transferDateTime < @operationDate AND -- look ony at earlier transfers
        transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate),0) AND --look back up to the start of month
        -- add cases bellow for P2P
        transferIdPrevTxn is NULL -- get only the first part of P2P txns. Also Balance Enquiries dont have prevIds


    -- Lifetime
    SELECT
        @amountLifetime = SUM(transferAmount),
        @countLifetime = COUNT(transferAmount)
    FROM
        [integration].[vTransfer]
    WHERE
        channelId = @actorId AND
        transferTypeId = @operationId AND
        transferDateTime < @operationDate AND -- look ony at earlier transfers from the beginning
        -- add cases bellow for P2P
        transferIdPrevTxn is NULL -- get only the first part of P2P txns. Also Balance Enquiries dont have prevIds

    DECLARE @matches TABLE (
        priority INT,
        conditionId BIGINT
    )

    DECLARE
        @minAmount MONEY,
        @maxAmount MONEY,
        @maxAmountDaily MONEY,
        @maxCountDaily BIGINT,
        @maxAmountWeekly MONEY,
        @maxCountWeekly BIGINT,
        @maxAmountMonthly MONEY,
        @maxCountMonthly BIGINT,
        -- Lifetime
        @maxAmountLifetime MONEY,
        @maxCountLifetime BIGINT

    INSERT INTO
        @matches
    SELECT
        [priority],conditionId
    FROM
        [rule].condition c
    WHERE
        (@channelRoleId IS NULL OR c.channelRoleId IS NULL OR @channelRoleId = c.channelRoleId) AND
        (c.operationId IS NULL OR @operationId = c.operationId) AND
        (c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate))


    SELECT
        @minAmount = NULL,
        @maxAmount = NULL,
        @maxAmountDaily = NULL,
        @maxCountDaily = NULL,
        @maxAmountWeekly = NULL,
        @maxCountWeekly = NULL,
        @maxAmountMonthly = NULL,
        @maxCountMonthly = NULL,
        -- Lifetime
        @maxAmountLifetime = NULL,
        @maxCountLifetime = NULL

    SELECT TOP 1
        @minAmount = l.minAmount,
        @maxAmount = l.maxAmount,
        @maxAmountDaily = l.maxAmountDaily,
        @maxCountDaily = l.maxCountDaily,
        @maxAmountWeekly = l.maxAmountWeekly,
        @maxCountWeekly = l.maxCountWeekly,
        @maxAmountMonthly = l.maxAmountMonthly,
        @maxCountMonthly = l.maxCountMonthly,
        -- Lifetime
        @maxAmountLifetime = l.maxAmountLifetime,
        @maxCountLifetime = l.maxCountLifetime
    FROM
        @matches AS c
    JOIN
        [rule].limit AS l ON l.conditionId = c.conditionId
    ORDER BY
        c.priority,
        l.limitId

    SELECT 'definedLimits' AS resultSetName, 1 single
    SELECT
        @minAmount AS minAmount,
        @maxAmount AS maxAmount,
        @maxAmountDaily AS maxAmountDaily,
        @maxCountDaily AS maxCountDaily,
        @maxAmountWeekly AS maxAmountWeekly,
        @maxCountWeekly AS maxCountWeekly,
        @maxAmountMonthly AS maxAmountMonthly,
        @maxCountMonthly AS maxCountMonthly,
        -- Lifetime
        @maxAmountLifetime AS maxAmountLifetime,
        @maxCountLifetime AS maxCountLifetime

    SELECT 'leftoverLimits' AS resultSetName, 1 single
    SELECT
        CASE WHEN @maxAmountDaily IS NOT NULL THEN @maxAmountDaily - ISNULL(@amountDaily,0) ELSE NULL END AS amountLeftDaily,
        CASE WHEN @maxCountDaily IS NOT NULL THEN @maxCountDaily - @countDaily ELSE NULL END AS countLeftDaily,
        CASE WHEN @maxAmountWeekly IS NOT NULL THEN @maxAmountWeekly - ISNULL(@amountWeekly,0) ELSE NULL END AS amountLeftWeekly,
        CASE WHEN @maxCountWeekly IS NOT NULL THEN @maxCountWeekly -  @countWeekly ELSE NULL END AS countLeftWeekly,
        CASE WHEN @maxAmountMonthly IS NOT NULL THEN @maxAmountMonthly - ISNULL(@amountMonthly,0) ELSE NULL END AS amountLeftMonthly,
        CASE WHEN @maxCountMonthly IS NOT NULL THEN @maxCountMonthly - @countMonthly ELSE NULL END AS countLeftMonthly,
        CASE WHEN @maxAmountLifetime IS NOT NULL THEN @maxAmountLifetime - ISNULL(@amountLifetime,0) ELSE NULL END AS amountLeftLifetime,
        CASE WHEN @maxCountLifetime IS NOT NULL THEN @maxCountLifetime -  @countLifetime ELSE NULL END AS  countLeftLifetime
END