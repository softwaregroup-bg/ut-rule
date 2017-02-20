ALTER PROCEDURE [rule].[decision.fetch]
    @channelCountryId BIGINT,
    @channelRegionId BIGINT,
    @channelCityId BIGINT,
    @channelOrganizationId BIGINT,
    @channelSupervisorId BIGINT,
    @channelRoleId BIGINT,
    @channelId BIGINT,
    @operationId BIGINT,
    @operationDate DATETIME,
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
    @amount MONEY,
    @totals [rule].totals READONLY,
    @currency VARCHAR(3),
    @isSourceAmount BIT,
    @sourceAccount varchar(100),
    @destinationAccount varchar(100)
AS
BEGIN
    DECLARE @matches TABLE (
        [priority] INT,
        conditionId BIGINT,
        operationTag NVARCHAR(50)
    )

    SET @operationDate = IsNull(@operationDate, GETDATE())

    DECLARE
        @calcCommission MONEY,
        @minCommission MONEY,
        @maxCommission MONEY,
        @idCommission BIGINT,
        @minAmount MONEY,
        @maxAmount MONEY,
        @amountDaily MONEY,
        @countDaily BIGINT,
        @amountWeekly MONEY,
        @countWeekly BIGINT,
        @amountMonthly MONEY,
        @countMonthly BIGINT,
        @maxAmountDaily MONEY,
        @maxCountDaily BIGINT,
        @maxAmountWeekly MONEY,
        @maxCountWeekly BIGINT,
        @maxAmountMonthly MONEY,
        @maxCountMonthly BIGINT

    INSERT INTO
        @matches([priority], conditionId, operationTag)
    SELECT
        [priority], conditionId, operationTag
    FROM
        [rule].condition c
    WHERE
        (@channelCountryId IS NULL OR c.channelCountryId IS NULL OR @channelCountryId = c.channelCountryId) AND
        (@channelRegionId IS NULL OR c.channelRegionId IS NULL OR @channelRegionId = c.channelRegionId) AND
        (@channelCityId IS NULL OR c.channelCityId IS NULL OR @channelCityId = c.channelCityId) AND
        (@channelOrganizationId IS NULL OR c.channelOrganizationId IS NULL OR @channelOrganizationId = c.channelOrganizationId) AND
        (@channelSupervisorId IS NULL OR c.channelSupervisorId IS NULL OR @channelSupervisorId = c.channelSupervisorId) AND
        (c.channelTag IS NULL OR @channelId IS NULL OR EXISTS(SELECT * from core.actorTag t WHERE t.actorId = @channelId AND c.channelTag LIKE '%|' + t.tag + '|%')) AND
        (@channelRoleId IS NULL OR c.channelRoleId IS NULL OR @channelRoleId = c.channelRoleId) AND
        (@channelId IS NULL OR c.channelId IS NULL OR @channelId = c.channelId) AND
        (@operationId IS NULL OR c.operationId IS NULL OR @operationId = c.operationId) AND
        (c.operationTag IS NULL OR @operationId IS NULL OR EXISTS(SELECT * from core.itemTag t WHERE t.itemNameId = @operationId AND c.operationTag LIKE '%|' + t.tag + '|%')) AND
        (@operationDate IS NULL OR c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (@operationDate IS NULL OR c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate)) AND
        (@sourceCountryId IS NULL OR c.sourceCountryId IS NULL OR @sourceCountryId = c.sourceCountryId) AND
        (@sourceRegionId IS NULL OR c.sourceRegionId IS NULL OR @sourceRegionId = c.sourceRegionId) AND
        (@sourceCityId IS NULL OR c.sourceCityId IS NULL OR @sourceCityId = c.sourceCityId) AND
        (@sourceOrganizationId IS NULL OR c.sourceOrganizationId IS NULL OR @sourceOrganizationId = c.sourceOrganizationId) AND
        (@sourceSupervisorId IS NULL OR c.sourceSupervisorId IS NULL OR @sourceSupervisorId = c.sourceSupervisorId) AND
        (c.sourceTag IS NULL OR @sourceId IS NULL OR EXISTS(SELECT * from core.actorTag t WHERE t.actorId = @sourceId AND c.sourceTag LIKE '%|' + t.tag + '|%')) AND
        (@sourceId IS NULL OR c.sourceId IS NULL OR @sourceId = c.sourceId) AND
        (@sourceCardProductId IS NULL OR c.sourceCardProductId IS NULL OR @sourceCardProductId = c.sourceCardProductId) AND
        (@sourceAccountProductId IS NULL OR c.sourceAccountProductId IS NULL OR @sourceAccountProductId = c.sourceAccountProductId) AND
        (@sourceAccountId IS NULL OR c.sourceAccountId IS NULL OR @sourceAccountId = c.sourceAccountId) AND
        (@destinationCountryId IS NULL OR c.destinationCountryId IS NULL OR @destinationCountryId = c.destinationCountryId) AND
        (@destinationRegionId IS NULL OR c.destinationRegionId IS NULL OR @destinationRegionId = c.destinationRegionId) AND
        (@destinationCityId IS NULL OR c.destinationCityId IS NULL OR @destinationCityId = c.destinationCityId) AND
        (@destinationOrganizationId IS NULL OR c.destinationOrganizationId IS NULL OR @destinationOrganizationId = c.destinationOrganizationId) AND
        (@destinationSupervisorId IS NULL OR c.destinationSupervisorId IS NULL OR @destinationSupervisorId = c.destinationSupervisorId) AND
        (c.destinationTag IS NULL OR @destinationId IS NULL OR EXISTS(SELECT * from core.actorTag t WHERE t.actorId = @destinationId AND c.destinationTag LIKE '%|' + t.tag + '|%')) AND
        (@destinationId IS NULL OR c.destinationId IS NULL OR @destinationId = c.destinationId) AND
        (@destinationAccountProductId IS NULL OR c.destinationAccountProductId IS NULL OR @destinationAccountProductId = c.destinationAccountProductId) AND
        (@destinationAccountId IS NULL OR c.destinationAccountId IS NULL OR @destinationAccountId = c.destinationAccountId)

    SELECT
        @minAmount = NULL,
        @maxAmount = NULL,
        @maxAmountDaily = NULL,
        @maxCountDaily = NULL,
        @maxAmountWeekly = NULL,
        @maxCountWeekly = NULL,
        @maxAmountMonthly = NULL,
        @maxCountMonthly = NULL

    SELECT TOP 1
        @minAmount = l.minAmount,
        @maxAmount = l.maxAmount,
        @maxAmountDaily = l.maxAmountDaily,
        @maxCountDaily = l.maxCountDaily,
        @maxAmountWeekly = l.maxAmountWeekly,
        @maxCountWeekly = l.maxCountWeekly,
        @maxAmountMonthly = l.maxAmountMonthly,
        @maxCountMonthly = l.maxCountMonthly,
        @amountDaily = ISNULL(t.amountDaily, 0),
        @countDaily = ISNULL(t.countDaily, 0),
        @amountWeekly = ISNULL(t.amountWeekly, 0),
        @countWeekly = ISNULL(t.countWeekly, 0),
        @amountMonthly = ISNULL(t.amountMonthly, 0),
        @countMonthly = ISNULL(t.countMonthly, 0)
    FROM
        @matches AS c
    LEFT JOIN
        @totals t ON c.operationTag LIKE '%|' + t.tag + '|%' OR (t.tag IS NULL AND c.operationTag IS NULL)
    JOIN
        [rule].limit AS l ON l.conditionId = c.conditionId
    WHERE
        l.currency = @currency
    ORDER BY
        c.priority,
        l.limitId

    IF @amount < @minAmount
    BEGIN
        RAISERROR('rule.exceedMinLimitAmount', 16, 1)
        RETURN
    END

    IF @amount > @maxAmount
    BEGIN
        RAISERROR('rule.exceedMaxLimitAmount', 16, 1)
        RETURN
    END

    IF @amount + @amountDaily > @maxAmountDaily
    BEGIN
        RAISERROR('rule.exceedDailyLimitAmount', 16, 1)
        RETURN
    END

    IF @amount + @amountWeekly > @maxAmountWeekly
    BEGIN
        RAISERROR('rule.exceedWeeklyLimitAmount', 16, 1)
        RETURN
    END

    IF @amount + @amountMonthly > @maxAmountMonthly
    BEGIN
        RAISERROR('rule.exceedMonthlyLimitAmount', 16, 1)
        RETURN
    END

    IF @countDaily >= @maxCountDaily
    BEGIN
        RAISERROR('rule.exceedDailyLimitCount', 16, 1)
        RETURN
    END

    IF @countWeekly >= @maxCountWeekly
    BEGIN
        RAISERROR('rule.exceedWeeklyLimitCount', 16, 1)
        RETURN
    END

    IF @countMonthly >= @maxCountMonthly
    BEGIN
        RAISERROR('rule.exceedMonthlyLimitCount', 16, 1)
        RETURN
    END

    DECLARE @fee TABLE(
        conditionId int,
        splitNameId int,
        fee MONEY,
        tag VARCHAR(MAX)
    );

    WITH split(conditionId, splitNameId, tag, minFee, maxFee, calcFee, rnk) AS (
        SELECT
            c.conditionId,
            r.splitNameId,
            n.tag,
            r.minValue,
            r.maxValue,
            ISNULL(r.[percent], 0) * CASE
                WHEN @amount > ISNULL(r.percentBase, 0) THEN @amount - ISNULL(r.percentBase, 0)
                ELSE 0
            END / 100,
            RANK() OVER (PARTITION BY n.splitNameId ORDER BY
                c.priority,
                r.startCountMonthly DESC,
                r.startAmountMonthly DESC,
                r.startCountWeekly DESC,
                r.startAmountWeekly DESC,
                r.startCountDaily DESC,
                r.startAmountDaily DESC,
                r.startAmount DESC,
                r.splitRangeId)
        FROM
            @matches AS c
        LEFT JOIN
            @totals t ON c.operationTag LIKE '%|' + t.tag + '|%' OR (t.tag IS NULL AND c.operationTag IS NULL)
        JOIN
            [rule].splitName AS n ON n.conditionId = c.conditionId
        JOIN
            [rule].splitRange AS r ON r.splitNameId = n.splitNameId
        WHERE
            @currency = r.startAmountCurrency AND
            COALESCE(@isSourceAmount, 0) = r.isSourceAmount AND
            @amount >= r.startAmount AND
            t.amountDaily >= r.startAmountDaily AND
            t.countDaily >= r.startCountDaily AND
            t.amountWeekly >= r.startAmountWeekly AND
            t.countWeekly >= r.startCountWeekly AND
            t.amountMonthly >= r.startAmountMonthly AND
            t.countMonthly >= r.startCountMonthly
    )
    INSERT INTO
        @fee(conditionId, splitNameId, fee, tag)
    SELECT
        s.conditionId,
        s.splitNameId,
        CASE
            WHEN s.calcFee>s.maxFee THEN s.maxFee
            WHEN s.calcFee<s.minFee THEN s.minFee
            ELSE s.calcFee
        END fee,
        s.tag
    FROM
        split s
    WHERE
        s.rnk = 1

    SELECT 'amount' AS resultSetName, 1 single
    SELECT
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|acquirer|%' AND tag LIKE '%|fee|%') acquirerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|issuer|%' AND tag LIKE '%|fee|%') issuerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|commission|%') commission,
        @operationDate transferDateTime,
        @operationId transferTypeId

    DECLARE @map [core].map

    INSERT INTO
        @map([key], [value])
    VALUES -- note that ${} is replaced by SQL port
        ('$' + '{channel.country}', 'item:' + CAST(@channelCountryId AS VARCHAR(100))),
        ('$' + '{channel.region}', 'item:' + CAST(@channelRegionId AS VARCHAR(100))),
        ('$' + '{channel.city}', 'item:' + CAST(@channelCityId AS VARCHAR(100))),
        ('$' + '{channel.organization}', 'actor:' + CAST(@channelOrganizationId AS VARCHAR(100))),
        ('$' + '{channel.supervisor}', 'actor:' + CAST(@channelSupervisorId AS VARCHAR(100))),
        ('$' + '{channel.role}', 'actor:' + CAST(@channelRoleId AS VARCHAR(100))),
        ('$' + '{channel.id}', 'actor:' + CAST(@channelId AS VARCHAR(100))),
        ('$' + '{operation.id}', 'item:' + CAST(@operationId AS VARCHAR(100))),
        ('$' + '{operation.currency}', CAST(@currency AS VARCHAR(100))),
        ('$' + '{source.country}', 'item:' + CAST(@sourceCountryId AS VARCHAR(100))),
        ('$' + '{source.region}', 'item:' + CAST(@sourceRegionId AS VARCHAR(100))),
        ('$' + '{source.city}', 'item:' + CAST(@sourceCityId AS VARCHAR(100))),
        ('$' + '{source.organization}', 'actor:' + CAST(@sourceOrganizationId AS VARCHAR(100))),
        ('$' + '{source.supervisor}', 'actor:' + CAST(@sourceSupervisorId AS VARCHAR(100))),
        ('$' + '{source.id}', 'actor:' + CAST(@sourceId AS VARCHAR(100))),
        ('$' + '{source.account.id}', CAST(@sourceAccountId AS VARCHAR(100))),
        ('$' + '{source.account.product}', CAST(@sourceAccountProductId AS VARCHAR(100))),
        ('$' + '{source.account.number}', CAST(@sourceAccount AS VARCHAR(100))),
        ('$' + '{source.card.product}', CAST(@sourceCardProductId AS VARCHAR(100))),
        ('$' + '{destination.country}', 'item:' + CAST(@destinationCountryId AS VARCHAR(100))),
        ('$' + '{destination.id}', 'actor:' + CAST(@destinationId AS VARCHAR(100))),
        ('$' + '{destination.region}', 'item:' + CAST(@destinationRegionId AS VARCHAR(100))),
        ('$' + '{destination.city}', 'item:' + CAST(@destinationCityId AS VARCHAR(100))),
        ('$' + '{destination.organization}', 'actor:' + CAST(@destinationOrganizationId AS VARCHAR(100))),
        ('$' + '{destination.supervisor}', 'actor:' + CAST(@destinationSupervisorId AS VARCHAR(100))),
        ('$' + '{destination.account.id}', CAST(@destinationAccountId AS VARCHAR(100))),
        ('$' + '{destination.account.product}', CAST(@destinationAccountProductId AS VARCHAR(100))),
        ('$' + '{destination.account.number}', CAST(@destinationAccount AS VARCHAR(100)))

    DELETE FROM @map WHERE [value] IS NULL

    SELECT 'split' AS resultSetName
    SELECT
        a.conditionId,
        a.splitNameId,
        a.tag,
        CAST(CASE
            WHEN assignment.[percent] * a.fee / 100 > assignment.maxValue THEN maxValue
            WHEN assignment.[percent] * a.fee / 100 < assignment.minValue THEN minValue
            ELSE assignment.[percent] * a.fee / 100
        END AS MONEY) amount,
        ISNULL(d.accountNumber, assignment.debit) debit,
        ISNULL(c.accountNumber, assignment.credit) credit,
        assignment.description,
        assignment.analytics
    FROM
        @fee a
    CROSS APPLY
        [rule].assignment(a.splitNameId, @map) assignment
    LEFT JOIN
        integration.vAssignment d ON d.accountId = assignment.debit
    LEFT JOIN
        integration.vAssignment c ON c.accountId = assignment.credit
END
