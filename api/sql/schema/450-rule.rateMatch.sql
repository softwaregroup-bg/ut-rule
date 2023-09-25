ALTER FUNCTION [rule].rateMatch(
    @matches [rule].matches READONLY,
    @targetCurrency VARCHAR(3),
    @currency VARCHAR(3),
    @amount MONEY,
    @amountType SMALLINT
) RETURNS TABLE AS RETURN (
    SELECT
        rateId,
        [name],
        rate
    FROM (SELECT
        c.conditionId,
        c.name,
        r.rateId,
        r.rate,
        RANK() OVER (PARTITION BY r.rateId ORDER BY
            c.priority,
            c.name,
            r.startCountMonthly DESC,
            r.startAmountMonthly DESC,
            r.startCountWeekly DESC,
            r.startAmountWeekly DESC,
            r.startCountDaily DESC,
            r.startAmountDaily DESC,
            r.startAmount DESC,
            r.rateId) rnk1,
        RANK() OVER (ORDER BY c.priority, c.name, c.conditionId) rnk2
    FROM
        @matches AS c
    JOIN
        [rule].rate AS r ON r.conditionId = c.conditionId
    WHERE
        @targetCurrency = r.targetCurrency AND
        @currency = r.startAmountCurrency AND
        @amount >= r.startAmount AND
        c.currency = @currency AND
        c.amountType = @amountType AND
        c.amountDaily >= r.startAmountDaily AND
        c.countDaily >= r.startCountDaily AND
        c.amountWeekly >= r.startAmountWeekly AND
        c.countWeekly >= r.startCountWeekly AND
        c.amountMonthly >= r.startAmountMonthly AND
        c.countMonthly >= r.startCountMonthly
    ) rate(conditionId, [name], rateId, rate, rnk1, rnk2)
    WHERE
        rnk1 = 1 AND
        rnk2 = 1
)
