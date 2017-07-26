ALTER PROCEDURE [rule].[decision.fetch]
    @operationProperties [rule].properties READONLY,
    @operationDate DATETIME,
    @sourceAccountId NVARCHAR(255),
    @destinationAccountId NVARCHAR(255),
    @amount MONEY,
    @totals [rule].totals READONLY,
    @currency VARCHAR(3),
    @isSourceAmount BIT,
    @sourceAccount varchar(100),
    @destinationAccount varchar(100),
    @maxAmountParam MONEY,
    @credentialsCheck BIGINT, 
    @credentials INT = NULL,
    @isTransactionValidate BIT = 0
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
        @maxCountMonthly BIGINT,        
        @checkSuccess BIT,
        @limitCredentials INT,
        @limitMaxAmount MONEY,
        @limitId INT

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
        @limitId = l.limitId,
        @minAmount = l.minAmount,
        @maxAmount = ISNULL(@maxAmountParam, l.maxAmount),
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
        @limitCredentials = l.[credentials],
        @limitMaxAmount = l.maxAmount
    FROM
        @matches AS c
    JOIN
        [rule].limit AS l ON l.conditionId = c.conditionId
    WHERE
        l.currency = @currency 
    AND 
        (
             @amount < l.minAmount OR
             @amount > ISNULL(@maxAmountParam, l.maxAmount) OR
             @amount + @amountDaily > l.maxAmountDaily OR
             @amount + @amountWeekly > l.maxAmountWeekly OR
             @amount + @amountMonthly > l.maxAmountMonthly OR
             @countDaily >= l.maxCountDaily OR
             @countWeekly >= l.maxCountWeekly OR
             @countMonthly >= l.maxCountMonthly        
        )   
    ORDER BY
        c.[priority],
        l.[priority]

    IF @limitCredentials = 0
        BEGIN            
            SET @checkSuccess = CASE 
                                     WHEN @amount > @maxAmountParam AND 
                                          @amount <= @limitMaxAmount AND 
                                          @isTransactionValidate = 1 
                                     THEN 1 
                                     WHEN @amount > @maxAmountParam AND 
                                          @amount <= @limitMaxAmount AND 
                                          @credentialsCheck IS NOT NULL AND 
                                          @credentialsCheck & @credentials = @credentialsCheck 
                                     THEN 1                                                                                 
                                     ELSE 0
                                END
        END    
    ELSE   
        BEGIN
            SET @credentialsCheck = COALESCE (@credentialsCheck, @limitCredentials, 0)
            SET @checkSuccess = CASE 
                                     WHEN  @limitId IS NULL OR 
                                           @credentialsCheck = 0 OR 
                                           @credentialsCheck & @credentials = @credentialsCheck 
                                     THEN 1                                             
                                     ELSE 0
                                 END
     END
    
    IF (@limitCredentials = 0 AND @checkSuccess = 0) OR @limitCredentials IS NULL
        BEGIN
            IF @amount < @minAmount
            BEGIN
                SELECT 'ruleData' resultSetName
                SELECT  @minAmount AS minAmount,
                        @maxAmount AS maxAmount,
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
                        @amount AS amount,
                        @amount + @amountDaily AS accumulatedAmountDaily,
                        @amount + @amountWeekly AS accumulatedAmountWeekly,
                        @amount + @amountMonthly AS accumulatedAmountMonthly

                SELECT 'ut-error' resultSetName,
                       'rule.exceedMinLimitAmount' [type],
                        @@servername serverName,
                        @@version [version]             
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
        END
    ELSE IF @checkSuccess = 0 AND ISNULL(@isTransactionValidate,0) <> 1
        BEGIN
            IF @amount < @minAmount
            BEGIN
                RAISERROR('rule.unauthorizedMinLimitAmount', 16, 1)
                RETURN
            END

            IF @amount > @maxAmount
            BEGIN
                RAISERROR('rule.unauthorizedMaxLimitAmount', 16, 1)
                RETURN
            END

            IF @amount + @amountDaily > @maxAmountDaily
            BEGIN
                RAISERROR('rule.unauthorizedDailyLimitAmount', 16, 1)
                RETURN
            END

            IF @amount + @amountWeekly > @maxAmountWeekly
            BEGIN
                RAISERROR('rule.unauthorizedWeeklyLimitAmount', 16, 1)
                RETURN
            END

            IF @amount + @amountMonthly > @maxAmountMonthly
            BEGIN
                RAISERROR('rule.unauthorizedMonthlyLimitAmount', 16, 1)
                RETURN
            END

            IF @countDaily >= @maxCountDaily
            BEGIN
                RAISERROR('rule.unauthorizedDailyLimitCount', 16, 1)
                RETURN
            END

            IF @countWeekly >= @maxCountWeekly
            BEGIN
                RAISERROR('rule.unauthorizedWeeklyLimitCount', 16, 1)
                RETURN
            END

            IF @countMonthly >= @maxCountMonthly
            BEGIN
                RAISERROR('rule.unauthorizedMonthlyLimitCount', 16, 1)
                RETURN
            END
        END
    ELSE IF @isTransactionValidate = 1 AND @limitId IS NOT NULL
        BEGIN
            SELECT 'ruleData' resultSetName
            SELECT  @minAmount AS minAmount,
                    @maxAmount AS maxAmount,
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
                    @amount AS amount,
                    @amount + @amountDaily AS accumulatedAmountDaily,
                    @amount + @amountWeekly AS accumulatedAmountWeekly,
                    @amount + @amountMonthly AS accumulatedAmountMonthly,
                    CASE WHEN @amount > ISNULL (@maxAmount, @maxAmountParam) THEN @credentialsCheck ELSE NULL END AS credentialsCheck                    
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
            COALESCE(@isSourceAmount, 0) = r.isSourceAmount AND
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
            WHEN s.calcFee>s.maxFee THEN s.maxFee
            WHEN s.calcFee<s.minFee THEN s.minFee
            ELSE s.calcFee
        END fee,
        s.tag
    FROM
        split s
    WHERE
        s.rnk1 = 1 AND
        s.rnk2 = 1

    SELECT 'amount' AS resultSetName, 1 single
    SELECT
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|acquirer|%' AND tag LIKE '%|fee|%') acquirerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|issuer|%' AND tag LIKE '%|fee|%') issuerFee,
        (SELECT ISNULL(SUM(fee), 0) FROM @fee WHERE tag LIKE '%|commission|%') commission,
        @operationDate transferDateTime,
        @transferTypeId transferTypeId

    DECLARE @map [core].map

    INSERT INTO
        @map([key], [value])
    SELECT
        '$' + '{' + name + '}', CASE WHEN factor IN ('so', 'do', 'co') THEN 'actor:' ELSE 'item:' END + CAST(value AS varchar(100))
    FROM
        @operationProperties

    INSERT INTO
        @map([key], [value])
    VALUES -- note that ${} is replaced by SQL port
        ('$' + '{operation.currency}', CAST(@currency AS VARCHAR(100))),
        ('$' + '{source.account.id}', 'account:' + CAST(@sourceAccountId AS VARCHAR(100))),
        ('$' + '{source.account.number}', CAST(@sourceAccount AS VARCHAR(100))),
        ('$' + '{destination.account.id}', 'account:' + CAST(@destinationAccountId AS VARCHAR(100))),
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
