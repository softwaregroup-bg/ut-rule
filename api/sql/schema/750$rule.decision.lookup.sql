ALTER PROCEDURE [rule].[decision.lookup]
    @channelType NVARCHAR(200),
    @operation NVARCHAR(200),
    @operationDate DATETIME,
    @sourceAccount VARCHAR(100),
    @destinationAccount VARCHAR(100),
    @amount MONEY,
    @currency VARCHAR(3),
    @sourceAccountOwnerId BIGINT = NULL,
    @destinationAccountOwnerId BIGINT = NULL,
    @sourceAccountRiskProfileId BIGINT = NULL,
    @sourceAccountCategory NVARCHAR(200) = NULL,
    @destinationAccountRiskProfileId BIGINT = NULL,
    @destinationAccountCategory NVARCHAR(200) = NULL
AS
BEGIN
    DECLARE
        @channelId BIGINT,
        @operationId BIGINT,
		@paymentAggregator BIGINT,
        @sourceAccountId NVARCHAR(255),
        @destinationAccountId NVARCHAR(255),
        @sourceAccountCategoryId BIGINT,
        @destinationAccountCategoryId BIGINT,
        @totals [rule].totals

    SELECT
        @operationId = n.itemNameId
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'operation'
    WHERE
        itemCode = @operation

	IF @operation LIKE 'walletToVendorBill' + '%'
		SET @paymentAggregator = (SELECT o.itemNameId FROM implementation.operation o WHERE o.operation ='walletToVendorBill')
	IF @operation LIKE 'walletToVendorMNO' + '%'
		SET @paymentAggregator = (SELECT o.itemNameId FROM implementation.operation o WHERE o.operation = 'walletToVendorMNO')
	IF @operation LIKE 'walletToVendorSelfMNO' + '%'
		SET @paymentAggregator = (SELECT o.itemNameId FROM implementation.operation o WHERE o.operation = 'walletToVendorSelfMNO')	
	
	SELECT
        @channelId = n.itemNameId
    FROM
        [core].[itemName] n
    JOIN
        [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'channelType'
    WHERE
        itemCode = @channelType
    
    IF @sourceAccountCategory IS NOT NULL
        SELECT
            @sourceAccountCategoryId = n.itemNameId
        FROM
            [core].[itemName] n
        JOIN
            [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'accountCategory'
        WHERE
            itemCode = @sourceAccountCategory

    IF @destinationAccountCategory IS NOT NULL
        SELECT
            @destinationAccountCategoryId = n.itemNameId
        FROM
            [core].[itemName] n
        JOIN
            [core].[itemType] t ON n.itemTypeId = t.itemTypeId AND t.alias = 'accountCategory'
        WHERE
            itemCode = @destinationAccountCategory

    SELECT @operationDate = ISNULL(@operationDate, GETDATE())

    INSERT INTO
        @totals(transferTypeId, amountDaily, countDaily, amountWeekly, countWeekly, amountMonthly, countMonthly)
    SELECT -- totals by transfer type
        t.transferTypeId,
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN t.transferAmount ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(DAY, DATEDIFF(DAY, 0, @operationDate), 0) THEN 1 ELSE 0 END), 0),
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate - 1), 0) THEN t.transferAmount ELSE 0 END), 0), --week starts on Mon
        ISNULL(SUM(CASE WHEN t.transferDateTime >= DATEADD(WEEK, DATEDIFF(WEEK, 0, @operationDate - 1), 0) THEN 1 ELSE 0 END), 0), --week starts on Mon
        ISNULL(SUM(t.transferAmount), 0),
        ISNULL(COUNT(t.transferAmount), 0)
    FROM
        [integration].[vTransfer] t
    WHERE
        t.success = 1 AND
        t.sourceAccount = @sourceAccount AND
        t.transferCurrency = @currency AND
        t.transferDateTime < @operationDate AND -- look ony at earlier transfers
        t.transferDateTime >= DATEADD(MONTH, DATEDIFF(MONTH, 0, @operationDate), 0) --look back up to the start of month
    GROUP BY
        t.transferTypeId

    DECLARE
        @operationProperties [rule].properties

    INSERT INTO
        @operationProperties(factor, name, value)
    SELECT
        'sr', 'source.role' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, r.actorId
    FROM
        core.actorGraph(@sourceAccountOwnerId, 'memberOf', 'subject') g
    CROSS APPLY
        core.actorGraph(g.actorId, 'role', 'subject') r
    WHERE
        g.actorId <> r.actorId
    UNION SELECT
        'dr', 'destination.role' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, r.actorId
    FROM
        core.actorGraph(@destinationAccountOwnerId, 'memberOf', 'subject') g
    CROSS APPLY
        core.actorGraph(g.actorId, 'role', 'subject') r
    WHERE
        g.actorId <> r.actorId
    UNION SELECT
        'so', 'source.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@sourceAccountOwnerId, 'memberOf', 'subject') g
    UNION SELECT
        'do', 'destination.owner.id' + CASE WHEN g.level > 0 THEN '^' + CAST(g.level AS VARCHAR(10)) ELSE '' END, g.actorId
    FROM
        core.actorGraph(@destinationAccountOwnerId, 'memberOf', 'subject') g

    INSERT INTO
        @operationProperties(factor, name, value)
    VALUES
        --channel spatial
        ('cs', 'channel.type', @channelId),
        --operation category
        ('oc', 'operation.id', @operationId),
		('oc', 'aggregator.id', @paymentAggregator),
        --source spatial
        ('ss', 'source.riskProfile', @sourceAccountRiskProfileId),
        --source category
        ('sc', 'source.account.category', @sourceAccountCategoryId),
        --destination spatial
        ('ds', 'destination.riskProfile', @destinationAccountRiskProfileId),
        --destination category
        ('dc', 'destination.account.category', @destinationAccountCategoryId)

    DELETE FROM @operationProperties WHERE value IS NULL

    EXEC [rule].[decision.fetch]
        @operationProperties = @operationProperties,
        @operationDate = @operationDate,
        @sourceAccountId = @sourceAccountId,
        @destinationAccountId = @destinationAccountId,
        @amount = @amount,
        @totals = @totals,
        @currency = @currency,
        @sourceAccount = @sourceAccount,
        @destinationAccount = @destinationAccount
END
