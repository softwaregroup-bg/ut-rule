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
    @operationTag VARCHAR(100),
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
    @amount MONEY,
    @amountDaily MONEY,
    @countDaily BIGINT,
    @amountWeekly MONEY,
    @countWeekly BIGINT,
    @amountMonthly MONEY,
    @countMonthly BIGINT,
    @currency VARCHAR(3),
    @isSourceAmount BIT
AS
BEGIN
    DECLARE @matches TABLE (
        priority INT,
        conditionId BIGINT
    )

    SET @operationDate = IsNull(@operationDate, GETDATE())

    DECLARE
        @calcCommission MONEY,
        @minCommission MONEY,
        @maxCommission MONEY,
        @idCommission BIGINT,
        @minAmount MONEY,
        @maxAmount MONEY,
        @maxAmountDaily MONEY,
        @maxCountDaily BIGINT,
        @maxAmountWeekly MONEY,
        @maxCountWeekly BIGINT,
        @maxAmountMonthly MONEY,
        @maxCountMonthly BIGINT

    INSERT INTO
        @matches
    SELECT
        [priority],conditionId
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
        (c.operationTag IS NULL OR (@operationTag IS NOT NULL AND c.operationTag LIKE '%|' + @operationTag + '|%')) AND
        -- (c.operationTag IS NULL OR @operationId IS NULL OR EXISTS(SELECT * from core.itemTag t WHERE t.itemNameId = @operationId AND c.operationTag LIKE '%|' + t.tag + '|%')) AND
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
        @maxCountMonthly = l.maxCountMonthly
    FROM
        @matches AS c
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
            RANK() OVER (PARTITION BY n.splitNameId ORDER BY c.priority, r.startAmount DESC, r.splitRangeId)
        FROM
            @matches AS c
        JOIN
            [rule].splitName AS n ON n.conditionId = c.conditionId
        JOIN
            [rule].splitRange AS r ON r.splitNameId = n.splitNameId
        WHERE
            @currency = r.startAmountCurrency AND
            COALESCE(@isSourceAmount, 0) = r.isSourceAmount AND
            @amount >= r.startAmount
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
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|acquirer|%') acquirerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|issuer|%') issuerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|commission|%') commission,
        @operationDate transferDateTime,
        @operationId transferTypeId

    SELECT 'split' AS resultSetName
    SELECT
        a.conditionId,
        a.splitNameId,
        a.tag,
        CAST(CASE
            WHEN assignment.[percent] * a.fee / 100 > maxValue THEN maxValue
            WHEN assignment.[percent] * a.fee / 100 < minValue THEN minValue
            ELSE assignment.[percent] * a.fee / 100
        END AS MONEY) amount,
        assignment.debit,
        assignment.credit,
        assignment.description
    FROM
        @fee a
    JOIN
        [rule].splitAssignment assignment ON assignment.splitNameId = a.splitNameId
END