ALTER PROCEDURE [rule].[decision.fetch]
    @operationProperties [rule].properties READONLY,
    @operationDate DATETIME,
    @sourceAccountId NVARCHAR(255),
    @destinationAccountId NVARCHAR(255),
    @amount MONEY,
    @totals [rule].totals READONLY,
    @currency VARCHAR(3),
    @sourceAccount varchar(100),
    @destinationAccount varchar(100)
AS
BEGIN
    DECLARE @transferTypeId BIGINT
    SELECT
        @transferTypeId = CAST(value AS BIGINT)
    FROM
        @operationProperties
    WHERE
        name = 'operation.id'

    DECLARE @matches TABLE (
        [priority] INT,
        conditionId BIGINT,
        amountDaily money,
        countDaily bigint,
        amountWeekly money,
        countWeekly bigint,
        amountMonthly money,
        countMonthly bigint
    )

    SET @operationDate = ISNULL(@operationDate, GETDATE())

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
        @matches(
            [priority],
            conditionId,
            amountDaily,
            countDaily,
            amountWeekly,
            countWeekly,
            amountMonthly,
            countMonthly)
    SELECT
        c.[priority],
        c.conditionId,
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
    LEFT JOIN
        @totals t ON t.transferTypeId = ISNULL(co.transferTypeId, @transferTypeId)
    WHERE
        (@operationDate IS NULL OR c.operationStartDate IS NULL OR (@operationDate >= c.operationStartDate)) AND
        (@operationDate IS NULL OR c.operationEndDate IS NULL OR (@operationDate <= c.operationEndDate)) AND
        [rule].falseActorFactorCount(c.conditionId, @operationProperties) = 0 AND
        [rule].falseItemFactorCount(c.conditionId, @operationProperties) = 0 AND
        [rule].falsePropertyFactorCount(c.conditionId, @operationProperties) = 0 AND
        (@sourceAccountId IS NULL OR c.sourceAccountId IS NULL OR @sourceAccountId = c.sourceAccountId) AND
        (@destinationAccountId IS NULL OR c.destinationAccountId IS NULL OR @destinationAccountId = c.destinationAccountId)
    GROUP BY
        c.[priority], c.conditionId

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
        @amountDaily = ISNULL(c.amountDaily, 0),
        @countDaily = ISNULL(c.countDaily, 0),
        @amountWeekly = ISNULL(c.amountWeekly, 0),
        @countWeekly = ISNULL(c.countWeekly, 0),
        @amountMonthly = ISNULL(c.amountMonthly, 0),
        @countMonthly = ISNULL(c.countMonthly, 0)
    FROM
        @matches AS c
    LEFT JOIN -- do not apply INNER JOIN, rule with less priority may not have limit
        [rule].limit AS l ON l.conditionId = c.conditionId AND l.currency = @currency
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

    WITH split(conditionId, splitNameId, tag, minFee, maxFee, calcFee, rnk1, rnk2) AS (
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
                r.splitRangeId),
            RANK() OVER (ORDER BY c.priority, c.conditionId)
        FROM
            @matches AS c
        JOIN
            [rule].splitName AS n ON n.conditionId = c.conditionId
        JOIN
            [rule].splitRange AS r ON r.splitNameId = n.splitNameId
        WHERE
            @currency = r.startAmountCurrency AND
            @amount >= r.startAmount AND
            c.amountDaily >= r.startAmountDaily AND
            c.countDaily >= r.startCountDaily AND
            c.amountWeekly >= r.startAmountWeekly AND
            c.countWeekly >= r.startCountWeekly AND
            c.amountMonthly >= r.startAmountMonthly AND
            c.countMonthly >= r.startCountMonthly
    )
    INSERT INTO
        @fee(conditionId, splitNameId, fee, tag)
    SELECT
        s.conditionId,
        s.splitNameId,
        CASE
            WHEN s.calcFee > s.maxFee THEN s.maxFee
            WHEN s.calcFee < s.minFee THEN s.minFee
            ELSE s.calcFee
        END fee,
        s.tag
    FROM
        split s
    WHERE
        s.rnk1 = 1 AND
        s.rnk2 = 1

	SELECT 'amount' AS resultSetName, 1 single
	IF EXISTS (SELECT COUNT(*) FROM core.itemName WHERE itemNameId = @transferTypeId
	AND (itemCode = 'p2p' OR itemCode = 'p2pForeignOut'))
	BEGIN

		DECLARE @transferTypeIdOnus int, @transferTypeIdOffus int, @waivedFeeP2P int

		SELECT @waivedFeeP2P = CAST([value] AS INT)
		FROM core.configuration
		WHERE [key] = 'waivedFeeP2P'

		IF EXISTS (SELECT @waivedFeeP2P)
		BEGIN
			INSERT INTO [core].[configuration]
				   ([key]
				   ,[value]
				   ,[description])
			 VALUES
				   ('waivedFeeP2P'
				   ,2
				   ,'Waived fee P2P')
			SELECT @waivedFeeP2P = 2
		END

		SELECT @transferTypeIdOnus = i.itemNameId 
		FROM core.itemName i
		LEFT JOIN core.itemType it ON i.itemTypeId = it.itemTypeId
		WHERE i.itemCode = 'p2p' AND it.alias = 'operation'

		SELECT @transferTypeIdOffus = i.itemNameId 
		FROM core.itemName i
		LEFT JOIN core.itemType it ON i.itemTypeId = it.itemTypeId
		WHERE i.itemCode = 'p2pForeignOut' AND it.alias = 'operation'

		IF (
		SELECT COUNT(*)
		  FROM [impl-cib-mwallet-dv-migration2].[cibTransfer].[transfer] T
		  WHERE sourceAccount = '01005224268'
		  AND [transferTypeId] IN (@transferTypeIdOnus, @transferTypeIdOffus)
		  AND MONTH(transferDateTime) = MONTH(GETDATE())
		 ) < @waivedFeeP2P
		 BEGIN
			SELECT
			0 AS otherTax,
			0 AS wth,
			0 AS vat,
			0 AS acquirerFee,
			0 AS issuerFee,
			0 AS commission,
			@operationDate transferDateTime,
			@transferTypeId transferTypeId
		 END
		 ELSE 
		 BEGIN 
			SELECT
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|otherTax|%') otherTax,
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|wth|%') wth,
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|vat|%') vat,
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|fee|%' AND tag NOT LIKE '%|issuer|%') acquirerFee,
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|issuer|%' AND tag LIKE '%|fee|%') issuerFee,
			(SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|commission|%' OR tag LIKE '%|agentCommission|%') commission,
			@operationDate transferDateTime,
			@transferTypeId transferTypeId
		 END
		
	END
	ELSE
	BEGIN
		SELECT
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|otherTax|%') otherTax,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|wth|%') wth,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|vat|%') vat,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|fee|%' AND tag NOT LIKE '%|issuer|%') acquirerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|issuer|%' AND tag LIKE '%|fee|%') issuerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|commission|%' OR tag LIKE '%|agentCommission|%') commission,
        @operationDate transferDateTime,
        @transferTypeId transferTypeId
	END
    
END
