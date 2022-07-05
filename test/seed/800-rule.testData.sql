-- Start rule part
DECLARE @ruleCondition bigint = (SELECT
    MIN(conditionId)
FROM
    [rule].[condition]
WHERE [priority] = 1)

IF @ruleCondition IS NULL
BEGIN
    INSERT
        [rule].[condition]
        ([priority])
    VALUES
        (1)

    SET @ruleCondition = SCOPE_IDENTITY()
END


DECLARE @splitNameCommission bigint = (SELECT
    MIN(splitNameId)
FROM
    [rule].[splitName]
WHERE conditionId = @ruleCondition AND [name] = N'commission')
DECLARE @splitNamefee bigint = (SELECT
    MIN(splitNameId)
FROM
    [rule].[splitName]
WHERE conditionId = @ruleCondition AND [name] = N'fee')

IF @splitNameCommission IS NULL
BEGIN
    INSERT
        [rule].splitName
        (conditionId, name, tag)
    VALUES
        (@ruleCondition, N'commission', N'|issuer|commission|')

    SET @splitNameCommission = SCOPE_IDENTITY()
END

IF @splitNamefee IS NULL
BEGIN
    INSERT
        [rule].splitName
        (conditionId, name, tag)
    VALUES
        (@ruleCondition, N'fee', N'|issuer|fee|')

    SET @splitNamefee = SCOPE_IDENTITY()
END


MERGE INTO [rule].[splitRange] AS target
USING(
    VALUES
    (@splitNamefee, 500.00, N'PHP', 0, 10.00, 15.00, 1, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNamefee, 1500.00, N'PHP', 0, 15.00, 100.00, 1, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNamefee, 0.00, N'PHP', 0, 5.00, 10.00, 2, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNameCommission, 10.00, N'PHP', 0, 1.00, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNameCommission, 20.00, N'PHP', 0, 2.00, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNameCommission, 1000.00, N'PHP', 0, 5.00, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0),
    (@splitNameCommission, 2000.00, N'PHP', 0, 10.00, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0)
    ) AS source (splitNameId, startAmount, startAmountCurrency, isSourceAmount, minValue, maxValue, [percent], percentBase, startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly)
ON target.[splitNameId] = source.[splitNameId]
    AND target.[startAmount] = source.[startAmount]
    AND target.[startAmountCurrency] = source.[startAmountCurrency]
    AND target.[startAmountDaily] = source.[startAmountDaily]
    AND target.[startCountDaily] = source.[startCountDaily]
    AND target.[startAmountWeekly] = source.[startAmountWeekly]
    AND target.[startCountWeekly] = source.[startCountWeekly]
    AND target.[startAmountMonthly] = source.[startAmountMonthly]
    AND target.[startCountMonthly] = source.[startCountMonthly]
WHEN MATCHED AND (target.[isSourceAmount] <> source.[isSourceAmount]
    OR target.[minValue] <> source.[minValue]
    OR target.[maxValue] <> source.[maxValue]
    OR target.[percent] <> source.[percent]
    OR target.[percentBase] <> source.[percentBase]
    )
    THEN
    UPDATE SET
        target.[isSourceAmount] = source.[isSourceAmount],
        target.[minValue] = source.[minValue],
        target.[maxValue] = source.[maxValue],
        target.[percent] = source.[percent],
        target.[percentBase] = source.[percentBase]
WHEN NOT MATCHED BY TARGET THEN
INSERT (splitNameId, startAmount, startAmountCurrency, isSourceAmount, minValue, maxValue, [percent], percentBase, startAmountDaily, startCountDaily, startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly)
VALUES (SOURCE.splitNameId, SOURCE.startAmount, SOURCE.startAmountCurrency, SOURCE.isSourceAmount, SOURCE.minValue, SOURCE.maxValue, SOURCE.[percent], SOURCE.percentBase, SOURCE.startAmountDaily, SOURCE.startCountDaily, SOURCE.startAmountWeekly, SOURCE.startCountWeekly, SOURCE.startAmountMonthly, SOURCE.startCountMonthly)
-- the output can be commented in production
--OUTPUT $action, DELETED.*, INSERTED.*
;

-- TODO: discuss with Kalin which are unique fields !!!!!!!
MERGE INTO [rule].[splitAssignment] AS target
USING(
    VALUES
    (@splitNamefee, N'd1', N'c1', NULL, NULL, 50, N'half 1'),
    (@splitNamefee, N'd2', N'c2', NULL, NULL, 50, N'half 2'),
    (@splitNameCommission, N'd3', N'c3', NULL, NULL, 20, N'20%'),
    (@splitNameCommission, N'd4', N'c4', NULL, NULL, 80, N'80%')
    ) AS source (splitNameId, debit, credit, minValue, maxValue, [percent], [description])
ON target.[splitNameId] = source.[splitNameId]
    AND target.[debit] = source.[debit]
    AND target.[credit] = source.[credit]
WHEN MATCHED AND (target.[minValue] <> source.[minValue]
    OR target.[maxValue] <> source.[maxValue]
    OR target.[percent] <> source.[percent]
    OR target.[description] <> source.[description]
    )
    THEN
    UPDATE SET
        target.[minValue] = source.[minValue],
        target.[maxValue] = source.[maxValue],
        target.[percent] = source.[percent],
        target.[description] = source.[description]
WHEN NOT MATCHED BY TARGET THEN
INSERT (splitNameId, debit, credit, minValue, maxValue, [percent], [description])
VALUES (SOURCE.splitNameId, SOURCE.debit, SOURCE.credit, SOURCE.minValue, SOURCE.maxValue, SOURCE.[percent], SOURCE.[description])
-- the output can be commented in production
--OUTPUT $action, DELETED.*, INSERTED.*
;
