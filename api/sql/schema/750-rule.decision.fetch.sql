ALTER PROCEDURE [rule].[decision.fetch]
    @operationProperties [rule].properties READONLY, -- properties collected based on the input information that will be checked against rule conditions (roles, products etc.)
    @operationDate DATETIME, -- the date when operation is triggered
    @sourceAccountId NVARCHAR(255), -- source account id
    @destinationAccountId NVARCHAR(255), -- destination account id
    @amountString VARCHAR(21), -- operation amount
    @settlementAmountString VARCHAR(21), -- settlement amount
    @accountAmountString VARCHAR(21), -- account amount
    @totals [rule].totals READONLY, -- totals by transfer type (amountDaily, countDaily, amountWeekly ... etc.)
    @currency VARCHAR(3), -- operation currency
    @settlementCurrency VARCHAR(3) = NULL, -- settlement currency
    @accountCurrency VARCHAR(3) = NULL, -- source account currency
    @isSourceAmount BIT,
    @sourceAccount VARCHAR(100), -- source account number
    @destinationAccount VARCHAR(100), -- destination account number
    @maxAmountParam MONEY, -- max amount from account or account product, after which credential validation is required
    @credentialsCheck INT, -- credentials from account or account product
    @credentials INT = NULL, -- the passed credentials to validate operation success
    @isTransactionValidate BIT = 0 -- flag showing if operation is only validated (1) or executed (0)
AS
BEGIN TRY
    DECLARE @amount MONEY = TRY_CONVERT(MONEY, @amountString)
    IF @amount IS NULL RAISERROR('rule.amount', 16, 1)
    DECLARE @transferTypeId BIGINT
    SELECT
        @transferTypeId = CAST(value AS BIGINT)
    FROM
        @operationProperties
    WHERE
        name = 'operation.id'

    DECLARE @matches [rule].matches

    SET @operationDate = ISNULL(@operationDate, GETUTCDATE())

    DECLARE
        @calcCommission MONEY,
        @minCommission MONEY,
        @maxCommission MONEY,
        @idCommission BIGINT,
        @amountType SMALLINT,
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
        @maxCountMonthly BIGINT,
        @checkSuccess BIT,
        @limitCredentials INT,
        @limitMaxAmount MONEY,
        @limitId INT,
        @conditionId INT

    --find all conditions(rules) that match based on the input information
    INSERT INTO
        @matches(
            [priority],
            [name],
            conditionId,
            currency,
            amountType,
            amountDaily,
            countDaily,
            amountWeekly,
            countWeekly,
            amountMonthly,
            countMonthly)
    SELECT
        c.[priority],
        c.[name],
        c.conditionId,
        types.currency,
        types.amountType,
        ISNULL(SUM(t.amountDaily), 0),
        ISNULL(SUM(t.countDaily), 0),
        ISNULL(SUM(t.amountWeekly), 0),
        ISNULL(SUM(t.countWeekly), 0),
        ISNULL(SUM(t.amountMonthly), 0),
        ISNULL(SUM(t.countMonthly), 0)
    FROM
        [rule].condition c
    LEFT JOIN
        [rule].vConditionOperation co ON co.conditionId = c.conditionId
    CROSS JOIN (VALUES
        (1, @currency),
        (2, COALESCE(@settlementCurrency, @currency)),
        (0, COALESCE(@accountCurrency, @settlementCurrency, @currency))
    ) types(amountType, currency)
    LEFT JOIN
        @totals t ON t.transferTypeId = ISNULL(co.transferTypeId, @transferTypeId)
        AND t.amountType = types.amountType
        AND t.currency = types.currency
    WHERE
        c.isDeleted = 0 AND
        (c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate)) AND
        [rule].falseActorFactorCount(c.conditionId, @operationProperties) = 0 AND
        [rule].falseItemFactorCount(c.conditionId, @operationProperties) = 0 AND
        [rule].falsePropertyFactorCount(c.conditionId, @operationProperties) = 0 AND
        (c.sourceAccountId IS NULL OR @sourceAccountId = c.sourceAccountId) AND
        (c.destinationAccountId IS NULL OR @destinationAccountId = c.destinationAccountId)
    GROUP BY
        c.[priority], c.[name], c.conditionId, types.currency, types.amountType

    DECLARE @scale TINYINT = 2, @currencyId INT
    SELECT @scale = scale, @currencyId = currencyId
    FROM core.currency c
    JOIN core.itemName it ON it.itemNameId = c.itemNameId
    WHERE itemCode = @currency

    DECLARE @settlementAmount MONEY = TRY_CONVERT(MONEY, @settlementAmountString)
    DECLARE @settlementRateId INT
    DECLARE @settlementRate DECIMAL(28, 14)
    DECLARE @settlementRateName NVARCHAR(100)
    SET @settlementCurrency = ISNULL(@settlementCurrency, @currency)
    IF @settlementCurrency = @currency AND @settlementAmount IS NULL SET @settlementAmount = @amount

    DECLARE @settlementScale TINYINT = 2, @settlementCurrencyId INT
    SELECT @settlementScale = scale, @settlementCurrencyId = currencyId
    FROM core.currency c
    JOIN core.itemName it ON it.itemNameId = c.itemNameId
    WHERE itemCode = @settlementCurrency

    IF @settlementCurrency <> @currency AND @settlementAmount IS NULL
    BEGIN
        SELECT
            @settlementRateId = rateId,
            @settlementRate = rate,
            @settlementRateName = [name],
            @settlementAmount = ROUND(@amount * rate, @settlementScale)
        FROM
            [rule].rateMatch(@matches, @settlementCurrency, @currency, @amount, 1)
    END

    DECLARE @accountAmount MONEY = TRY_CONVERT(MONEY, @accountAmountString)
    DECLARE @accountRate DECIMAL(28, 14)
    DECLARE @accountRateId INT
    DECLARE @accountRateName NVARCHAR(100)
    SET @accountCurrency = ISNULL(@accountCurrency, @settlementCurrency)
    IF @accountCurrency = @settlementCurrency AND @accountAmount IS NULL SET @accountAmount = @settlementAmount

    DECLARE @accountScale TINYINT = 2, @accountCurrencyId INT
    SELECT @accountScale = scale, @accountCurrencyId = currencyId
    FROM core.currency c
    JOIN core.itemName it ON it.itemNameId = c.itemNameId
    WHERE itemCode = @accountCurrency

    IF @accountCurrency <> @settlementCurrency AND @accountAmount IS NULL
    BEGIN
        SELECT
            @accountRate = rate,
            @accountRateId = rateId,
            @accountRateName = [name],
            @accountAmount = ROUND(@settlementAmount * rate, @accountScale)
        FROM
            [rule].rateMatch(@matches, @accountCurrency, @settlementCurrency, @settlementAmount, 2)
    END

    SELECT
        @amountType = NULL,
        @minAmount = NULL,
        @maxAmount = NULL,
        @maxAmountDaily = NULL,
        @maxCountDaily = NULL,
        @maxAmountWeekly = NULL,
        @maxCountWeekly = NULL,
        @maxAmountMonthly = NULL,
        @maxCountMonthly = NULL

    -- check if exists a condition limit that is violated
    SELECT TOP 1
        @limitId = l.limitId,
        @conditionId = l.conditionId,
        @amountType = l.amountType,
        @minAmount = l.minAmount,
        @maxAmount = l.maxAmount,
        @maxAmountDaily = l.maxAmountDaily,
        @maxCountDaily = l.maxCountDaily,
        @maxAmountWeekly = l.maxAmountWeekly,
        @maxCountWeekly = l.maxCountWeekly,
        @maxAmountMonthly = l.maxAmountMonthly,
        @maxCountMonthly = l.maxCountMonthly,
        @amountDaily = ISNULL(c.amountDaily, 0),
        @countDaily = ISNULL(c.countDaily, 0),
        @amountWeekly = ISNULL(c.amountWeekly, 0),
        @countWeekly = ISNULL(c.countWeekly, 0),
        @amountMonthly = ISNULL(c.amountMonthly, 0),
        @countMonthly = ISNULL(c.countMonthly, 0),
        @limitCredentials = l.[credentials]
    FROM
        @matches AS c
    JOIN
        [rule].limit AS l ON l.conditionId = c.conditionId AND ISNULL(l.amountType, 0) = c.amountType AND l.currency = c.currency
    WHERE
        (--violation of condition limits
            CASE l.amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END < l.minAmount OR
            CASE l.amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END > l.maxAmount OR
            CASE l.amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END + ISNULL(c.amountDaily, 0) > l.maxAmountDaily OR
            CASE l.amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END + ISNULL(c.amountWeekly, 0) > l.maxAmountWeekly OR
            CASE l.amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END + ISNULL(c.amountMonthly, 0) > l.maxAmountMonthly OR
            ISNULL(c.countDaily, 0) >= l.maxCountDaily OR
            ISNULL(c.countWeekly, 0) >= l.maxCountWeekly OR
            ISNULL(c.countMonthly, 0) >= l.maxCountMonthly
        ) AND (--violation of limit credentials
            @credentials IS NULL OR -- no checked credentials passed by the backend
            ISNULL(l.[credentials], 0) = 0 OR -- limit credentials equal to NULL or 0 means that condition limits cannot be exceeded
            @credentials & ISNULL (@credentialsCheck, l.[credentials]) <> ISNULL (@credentialsCheck, l.[credentials])
        )
    ORDER BY
        c.[priority],
        c.[name],
        l.[priority]

    IF @limitId IS NOT NULL -- if exists a condition limit which is violated, identify the exact violation and return error with result
    BEGIN
        DECLARE @type VARCHAR (20) = CASE WHEN ISNULL(@limitCredentials, 0) = 0 THEN 'rule.exceed' ELSE 'rule.unauthorized' END
        DECLARE @limitAmount MONEY = CASE @amountType WHEN 1 THEN @amount WHEN 2 THEN @settlementAmount ELSE @accountAmount END
        DECLARE @error VARCHAR (50) = CASE
            WHEN @limitAmount > @maxAmount THEN @type + 'MaxLimitAmount'
            WHEN @limitAmount < @minAmount THEN @type + 'MinLimitAmount'
            WHEN @amountDaily >= @maxAmountDaily THEN 'rule.reachedDailyLimitAmount'
            WHEN @amountWeekly >= @maxAmountWeekly THEN 'rule.reachedWeeklyLimitAmount'
            WHEN @amountMonthly >= @maxAmountMonthly THEN 'rule.reachedMonthlyLimitAmount'
            WHEN @limitAmount + @amountDaily > @maxAmountDaily THEN @type + 'DailyLimitAmount'
            WHEN @limitAmount + @amountWeekly > @maxAmountWeekly THEN @type + 'WeeklyLimitAmount'
            WHEN @limitAmount + @amountMonthly > @maxAmountMonthly THEN @type + 'MonthlyLimitAmount'
            WHEN @countDaily >= @maxCountDaily THEN @type + 'DailyLimitCount'
            WHEN @countWeekly >= @maxCountWeekly THEN @type + 'WeeklyLimitCount'
            WHEN @countMonthly >= @maxCountMonthly THEN @type + 'MonthlyLimitCount'
        END

        SELECT
            'ut-error' resultSetName,
            @error type,
            @amountType AS amountType,
            @minAmount AS minAmount,
            ISNULL (@maxAmountParam, @maxAmount) AS maxAmount,
            @maxAmountDaily AS maxAmountDaily,
            @maxCountDaily AS maxCountDaily,
            @maxAmountWeekly AS maxAmountWeekly,
            @maxCountWeekly AS maxCountWeekly,
            @maxAmountMonthly AS maxAmountMonthly,
            @maxCountMonthly AS maxCountMonthly,
            @amountDaily AS amountDaily,
            @countDaily AS countDaily,
            @amountWeekly AS amountWeekly,
            @countWeekly AS countWeekly,
            @amountMonthly AS amountMonthly,
            @countMonthly AS countMonthly,
            @accountAmount AS amount,
            @accountAmount + @amountDaily AS accumulatedAmountDaily,
            @accountAmount + @amountWeekly AS accumulatedAmountWeekly,
            @accountAmount + @amountMonthly AS accumulatedAmountMonthly,
            ISNULL (@credentialsCheck, @limitCredentials) AS [credentials],
            @conditionId AS conditionId
        IF ISNULL (@isTransactionValidate, 0) = 0 RETURN -- if only validation - proceed, else stop execution
    END
    ELSE -- if not exists a condition limit which is violated, check if credentials are correct. If not return error and result
    IF @amount > @maxAmountParam AND ISNULL(@credentials, 0) & @credentialsCheck <> @credentialsCheck
    BEGIN
        SELECT
            'ut-error' resultSetName,
            CASE WHEN ISNULL(@credentialsCheck, 0) = 0 THEN 'rule.exceed' ELSE 'rule.unauthorized' END + 'MaxLimitAmount' type,
            @maxAmountParam AS maxAmount,
            @minAmount AS minAmount,
            @maxAmountDaily AS maxAmountDaily,
            @maxCountDaily AS maxCountDaily,
            @maxAmountWeekly AS maxAmountWeekly,
            @maxCountWeekly AS maxCountWeekly,
            @maxAmountMonthly AS maxAmountMonthly,
            @maxCountMonthly AS maxCountMonthly,
            @amountDaily AS amountDaily,
            @countDaily AS countDaily,
            @amountWeekly AS amountWeekly,
            @countWeekly AS countWeekly,
            @amountMonthly AS amountMonthly,
            @countMonthly AS countMonthly,
            @accountAmount AS amount,
            @accountAmount + @amountDaily AS accumulatedAmountDaily,
            @accountAmount + @amountWeekly AS accumulatedAmountWeekly,
            @accountAmount + @amountMonthly AS accumulatedAmountMonthly,
            @credentialsCheck AS [credentials]

        IF ISNULL (@isTransactionValidate, 0) = 0 RETURN -- if only validation - proceed, else stop execution
    END

    DECLARE @fee TABLE(
        conditionId INT,
        conditionName NVARCHAR(100),
        splitNameId INT,
        currency VARCHAR(3),
        amountType SMALLINT,
        fee MONEY,
        tag VARCHAR(MAX)
    );

    -- calculate the operation fees based on the matched conditions (rules), and select these with highest priority
    WITH split(conditionId, [name], splitNameId, startAmountCurrency, amountType, tag, minFee, maxFee, calcFee, rnk1, rnk2) AS (
        SELECT
            c.conditionId,
            c.name,
            r.splitNameId,
            r.startAmountCurrency,
            n.amountType,
            n.tag,
            r.minValue,
            r.maxValue,
            ISNULL(r.[percent], 0) * CASE
                WHEN
                    CASE n.amountType
                        WHEN 1 THEN @amount
                        WHEN 2 THEN @settlementAmount
                        ELSE @accountAmount
                    END > ISNULL(r.percentBase, 0)
                THEN
                    CASE n.amountType
                        WHEN 1 THEN @amount
                        WHEN 2 THEN @settlementAmount
                        ELSE @accountAmount
                    END - ISNULL(r.percentBase, 0)
                ELSE 0
            END / 100,
            RANK() OVER (PARTITION BY n.splitNameId ORDER BY
                c.priority,
                c.name,
                r.startCountMonthly DESC,
                r.startAmountMonthly DESC,
                r.startCountWeekly DESC,
                r.startAmountWeekly DESC,
                r.startCountDaily DESC,
                r.startAmountDaily DESC,
                r.startAmount DESC,
                r.splitRangeId),
            RANK() OVER (ORDER BY c.priority, c.name, c.conditionId)
        FROM
            @matches AS c
        JOIN
            [rule].splitName AS n ON n.conditionId = c.conditionId
        JOIN
            [rule].splitRange AS r ON r.splitNameId = n.splitNameId
        WHERE
            COALESCE(@isSourceAmount, 0) = r.isSourceAmount AND
            CASE n.amountType
                WHEN 1 THEN @amount
                WHEN 2 THEN @settlementAmount
                ELSE @accountAmount
            END >= r.startAmount AND
            c.currency = r.startAmountCurrency AND
            c.amountType = ISNULL(n.amountType, 0) AND
            c.amountDaily >= r.startAmountDaily AND
            c.countDaily >= r.startCountDaily AND
            c.amountWeekly >= r.startAmountWeekly AND
            c.countWeekly >= r.startCountWeekly AND
            c.amountMonthly >= r.startAmountMonthly AND
            c.countMonthly >= r.startCountMonthly
    )
    INSERT INTO
        @fee(conditionId, conditionName, splitNameId, currency, amountType, fee, tag)
    SELECT
        s.conditionId,
        s.name,
        s.splitNameId,
        s.startAmountCurrency,
        s.amountType,
        ROUND(CASE
            WHEN s.calcFee > s.maxFee THEN s.maxFee
            WHEN s.calcFee < s.minFee THEN s.minFee
            ELSE s.calcFee
        END, CASE s.amountType
            WHEN 1 THEN @scale
            WHEN 2 THEN @settlementScale
            ELSE @accountScale
        END) fee,
        s.tag
    FROM
        split s
    WHERE
        s.rnk1 = 1 AND
        s.rnk2 = 1

    SELECT 'amount' AS resultSetName, 1 single
    SELECT
        CONVERT(VARCHAR(21), @settlementAmount, 2) settlementAmount,
        @settlementCurrency settlementCurrency,
        @settlementRate settlementRate,
        @settlementRateId settlementRateId,
        @settlementRateName settlementRateConditionName,
        CONVERT(VARCHAR(21), @accountAmount, 2) accountAmount,
        @accountCurrency accountCurrency,
        @accountRate accountRate,
        @accountRateId accountRateId,
        @accountRateName accountRateConditionName,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType = 1 AND tag LIKE '%|acquirer|%' AND tag LIKE '%|fee|%'), 2) acquirerFee,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType IS NULL AND tag LIKE '%|issuer|%' AND tag LIKE '%|fee|%'), 2) issuerFee,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType = 1 AND tag LIKE '%|processor|%' AND tag LIKE '%|fee|%'), 2) processorFee,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType IS NULL AND tag LIKE '%|fee|%'), 2) transferFee,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType IS NULL AND tag LIKE '%|commission|%'), 2) commission,
        CONVERT(VARCHAR(21), (SELECT SUM(ISNULL(fee, 0)) FROM @fee WHERE amountType IS NULL AND tag LIKE '%|cashback|%'), 2) cashback,
        @operationDate transferDateTime,
        @transferTypeId transferTypeId

    DECLARE @map [core].map

    -- calculate the splits based on the selected condition
    INSERT INTO
        @map([key], [value])
    SELECT
        '$' + '{' + name + '}', CASE WHEN factor IN ('so', 'do', 'co') THEN 'actor:' ELSE 'item:' END + CAST(value AS VARCHAR(100))
    FROM
        @operationProperties

    INSERT INTO
        @map([key], [value])
    VALUES -- note that ${} is replaced by SQL port
        ('$' + '{operation.currency}', CAST(@currency AS VARCHAR(100))),
        ('$' + '{transfer.amount}', CONVERT(VARCHAR(100), @amount, 2)),
        ('$' + '{transfer.settlementAmount}', CONVERT(VARCHAR(100), @settlementAmount, 2)),
        ('$' + '{transfer.accountAmount}', CONVERT(VARCHAR(100), @accountAmount, 2)),
        ('$' + '{transfer.currencyId}', CAST(@currencyId AS VARCHAR(100))),
        ('$' + '{transfer.settlementCurrencyId}', CAST(@settlementCurrencyId AS VARCHAR(100))),
        ('$' + '{transfer.accountCurrencyId}', CAST(@accountCurrencyId AS VARCHAR(100))),
        ('$' + '{source.account.id}', 'account:' + CAST(@sourceAccountId AS VARCHAR(100))),
        ('$' + '{source.account.number}', CAST(@sourceAccount AS VARCHAR(100))),
        ('$' + '{destination.account.id}', 'account:' + CAST(@destinationAccountId AS VARCHAR(100))),
        ('$' + '{destination.account.number}', CAST(@destinationAccount AS VARCHAR(100)))

    DELETE FROM @map WHERE [value] IS NULL

    SELECT 'split' AS resultSetName
    SELECT
        a.conditionId,
        a.conditionName,
        a.splitNameId,
        a.tag,
        a.currency,
        CONVERT(VARCHAR, ROUND(CAST(CASE
            WHEN assignment.[percent] * a.fee / 100 > assignment.maxValue THEN maxValue
            WHEN assignment.[percent] * a.fee / 100 < assignment.minValue THEN minValue
            ELSE assignment.[percent] * a.fee / 100
        END AS MONEY), CASE a.amountType
            WHEN 1 THEN @scale
            WHEN 2 THEN @settlementScale
            ELSE @accountScale
        END), 2) amount,
        assignment.quantity quantity,
        ISNULL(d.accountNumber, assignment.debit) debit,
        ISNULL(c.accountNumber, assignment.credit) credit,
        assignment.description,
        assignment.analytics
    FROM
        @fee a
    CROSS APPLY
        [rule].assignment(a.splitNameId, @map) assignment
    LEFT JOIN
        integration.vAssignment d ON CAST(d.accountId AS VARCHAR(100)) = assignment.debit
    LEFT JOIN
        integration.vAssignment c ON CAST(c.accountId AS VARCHAR(100)) = assignment.credit
    ORDER BY
        a.splitNameId, assignment.splitAssignmentId

    SELECT 'decision' AS resultSetName, 1 single
    SELECT TOP 1 c.conditionId, c.name, c.decision
    FROM @matches m
    JOIN [rule].condition c ON c.conditionId = m.conditionId
    WHERE m.amountType = 0
    ORDER BY m.priority, m.name
END TRY
BEGIN CATCH
    IF @@trancount > 0
        ROLLBACK TRANSACTION
    EXEC [core].[error]
    RETURN 55555
END CATCH
