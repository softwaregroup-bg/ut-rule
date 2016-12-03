ALTER PROCEDURE [rule].[decision.fetch]
    @channelCountryId BIGINT,
    @channelRegionId BIGINT,
    @channelCityId BIGINT,
    @channelOrganizationId BIGINT,
    @channelSupervisorId BIGINT,
    @channelTags VARCHAR(255),
    @channelRoleId BIGINT,
    @channelId BIGINT,
    @operationId BIGINT,
    @operationTags VARCHAR(255),
    @operationDate DATETIME,
    @sourceCountryId BIGINT,
    @sourceRegionId BIGINT,
    @sourceCityId BIGINT,
    @sourceOrganizationId BIGINT,
    @sourceSupervisorId BIGINT,
    @sourceTags VARCHAR(255),
    @sourceId BIGINT,
    @sourceProductId BIGINT,
    @sourceAccountId BIGINT,
    @destinationCountryId BIGINT,
    @destinationRegionId BIGINT,
    @destinationCityId BIGINT,
    @destinationOrganizationId BIGINT,
    @destinationSupervisorId BIGINT,
    @destinationTags VARCHAR(255),
    @destinationId BIGINT,
    @destinationProductId BIGINT,
    @destinationAccountId BIGINT,
    @amount MONEY,
    @currency VARCHAR(3),
    @isSourceAmount BIT
AS
BEGIN
    DECLARE @matches TABLE (
        priority INT
        ,conditionId BIGINT
    )

    SET @operationDate = IsNull(@operationDate, GETDATE())

    DECLARE
        @calc MONEY,
        @minAmount MONEY,
        @maxAmount MONEY,
        @id BIGINT

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
        (@channelTags IS NULL OR c.channelTag IS NULL OR @channelTags LIKE ('%|' + c.channelTag + '|%')) AND
        (@channelRoleId IS NULL OR c.channelRoleId IS NULL OR @channelRoleId = c.channelRoleId) AND
        (@channelId IS NULL OR c.channelId IS NULL OR @channelId = c.channelId) AND
        (@operationId IS NULL OR c.operationId IS NULL OR @operationId = c.operationId) AND
        (@operationTags IS NULL OR c.operationTag IS NULL OR @operationTags LIKE ('%|' + c.operationTag + '|%')) AND
        (@operationDate IS NULL OR c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (@operationDate IS NULL OR c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate)) AND
        (@sourceCountryId IS NULL OR c.sourceCountryId IS NULL OR @sourceCountryId = c.sourceCountryId) AND
        (@sourceRegionId IS NULL OR c.sourceRegionId IS NULL OR @sourceRegionId = c.sourceRegionId) AND
        (@sourceCityId IS NULL OR c.sourceCityId IS NULL OR @sourceCityId = c.sourceCityId) AND
        (@sourceOrganizationId IS NULL OR c.sourceOrganizationId IS NULL OR @sourceOrganizationId = c.sourceOrganizationId) AND
        (@sourceSupervisorId IS NULL OR c.sourceSupervisorId IS NULL OR @sourceSupervisorId = c.sourceSupervisorId) AND
        (@sourceTags IS NULL OR c.sourceTag IS NULL OR @sourceTags LIKE ('%|' + c.sourceTag + '|%')) AND
        (@sourceId IS NULL OR c.sourceId IS NULL OR @sourceId = c.sourceId) AND
        (@sourceProductId IS NULL OR c.sourceProductId IS NULL OR @sourceProductId = c.sourceProductId) AND
        (@sourceAccountId IS NULL OR c.sourceAccountId IS NULL OR @sourceAccountId = c.sourceAccountId) AND
        (@destinationCountryId IS NULL OR c.destinationCountryId IS NULL OR @destinationCountryId = c.destinationCountryId) AND
        (@destinationRegionId IS NULL OR c.destinationRegionId IS NULL OR @destinationRegionId = c.destinationRegionId) AND
        (@destinationCityId IS NULL OR c.destinationCityId IS NULL OR @destinationCityId = c.destinationCityId) AND
        (@destinationOrganizationId IS NULL OR c.destinationOrganizationId IS NULL OR @destinationOrganizationId = c.destinationOrganizationId) AND
        (@destinationSupervisorId IS NULL OR c.destinationSupervisorId IS NULL OR @destinationSupervisorId = c.destinationSupervisorId) AND
        (@destinationTags IS NULL OR c.destinationTag IS NULL OR @destinationTags LIKE ('%|' + c.destinationTag + '|%')) AND
        (@destinationId IS NULL OR c.destinationId IS NULL OR @destinationId = c.destinationId) AND
        (@destinationProductId IS NULL OR c.destinationProductId IS NULL OR @destinationProductId = c.destinationProductId) AND
        (@destinationAccountId IS NULL OR c.destinationAccountId IS NULL OR @destinationAccountId = c.destinationAccountId)

    SELECT 'limit' AS resultSetName, 1 AS single
    SELECT TOP 1
        l.minAmount,
        l.maxAmount,
        l.maxCountDaily AS [count]
    FROM
        @matches AS c
    JOIN
        [rule].limit AS l ON l.conditionId = c.conditionId
    WHERE
        l.currency = @currency
    ORDER BY
        c.priority,
        l.limitId

    SELECT @calc=0, @minAmount=0, @maxAmount=0
    SELECT TOP 1
        @id = f.feeId,
        @minAmount = f.minValue,
        @maxAmount = f.maxValue,
        @calc = ISNULL(f.[percent], 0) * CASE
            WHEN @amount > ISNULL(f.percentBase, 0) THEN @amount - ISNULL(f.percentBase, 0)
            ELSE 0
        END / 100
    FROM
        @matches AS c
    JOIN
        [rule].fee AS f ON f.conditionId = c.conditionId
    WHERE
        @currency = f.startAmountCurrency AND
        COALESCE(@isSourceAmount, 1) = f.isSourceAmount AND
        @amount >= f.startAmount
    ORDER BY
        c.priority,
        f.startAmount DESC,
        f.feeId

    SELECT 'fee' AS resultSetName, 1 AS single
    SELECT
        CASE
            WHEN @calc>@maxAmount THEN @maxAmount
            WHEN @calc<@minAmount THEN @minAmount
            ELSE @calc
        END amount,
        @id id,
        @operationDate transferDateTime

    SELECT @calc=0, @minAmount=0, @maxAmount=0
    SELECT TOP 1
        @id = f.commissionId,
        @minAmount = f.minValue,
        @maxAmount = f.maxValue,
        @calc = ISNULL(f.[percent], 0) * CASE
            WHEN @amount > ISNULL(f.percentBase, 0) THEN @amount - ISNULL(f.percentBase, 0)
            ELSE 0
        END / 100
    FROM
        @matches AS c
    JOIN
        [rule].commission AS f ON f.conditionId = c.conditionId
    WHERE
        @currency = f.startAmountCurrency AND
        COALESCE(@isSourceAmount, 1) = f.isSourceAmount AND
        @amount >= f.startAmount
    ORDER BY
        c.priority,
        f.startAmount DESC,
        f.commissionId

    SELECT 'commission' AS resultSetName, 1 AS single
    SELECT
        CASE
            WHEN @calc>@maxAmount THEN @maxAmount
            WHEN @calc<@minAmount THEN @minAmount
            ELSE @calc
        END amount,
        @id id

END