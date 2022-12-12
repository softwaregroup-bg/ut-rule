ALTER PROCEDURE [rule].[rule.merge]
    @condition [rule].conditionCustom READONLY,
    @limit [rule].limitCustom READONLY,
    @splitName [rule].splitNameCustom READONLY,
    @splitRange [rule].splitRangeCustom READONLY,
    @splitAssignment [rule].splitAssignmentCustom READONLY,
    @splitAnalytic [rule].splitAnalyticCustom READONLY,
    @meta core.metaDataTT READONLY -- information for the logged user
AS
DECLARE @callParams XML
DECLARE @userId BIGINT = (SELECT [auth.actorId] FROM @meta)
DECLARE @conditionTT [rule].conditionTT
DECLARE @conditionActor [rule].conditionActorCustom,
    @conditionItem [rule].conditionItemCustom,
    @conditionProperty [rule].conditionPropertyCustom

DECLARE @helpTable TABLE(conditionName NVARCHAR(100), factor CHAR(2), factorText VARCHAR(200), factorValue BIGINT)
BEGIN TRY

    INSERT INTO @conditionTT(priority, operationStartDate, operationEndDate, sourceAccountId, destinationAccountId,
        name, description, notes, createdBy)
    SELECT ISNULL(co.priority, 1), co. operationStartDate, co. operationEndDate, co. sourceAccountId, co. destinationAccountId,
        co.name, co.description, co.notes, co.createdBy
    FROM @condition co
    LEFT JOIN [rule].condition c ON c.name = co.name
    WHERE c.conditionId IS NULL

    INSERT INTO @conditionActor(conditionName, factor, actorId)
    SELECT r.name, 'co', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.channelOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))
    WHERE c.channelOrganization IS NOT NULL
    UNION ALL
    SELECT r.name, 'so', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))
    WHERE c.holderOrganization IS NOT NULL
    UNION ALL
    SELECT r.name, 'do', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))
    WHERE c.counterpartyOrganization IS NOT NULL

    IF EXISTS (SELECT * FROM @conditionActor WHERE actorid IS NULL)
        THROW 55555, 'rule.notExistingOrganizationName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'oc', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('operation', c.operation) i

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingOperationName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('country', c.channelCountry) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('country', c.holderCountry) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('country', c.counterpartyCountry) i

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingCountryName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('region', c.channelRegion) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('region', c.holderRegion) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('region', c.counterpartyRegion) i

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingRegionName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('city', c.channelCity) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('city', c.holderCity) i

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.value
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.itemRows('city', c.counterpartyCity) i

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingCityName', 1

    IF EXISTS (SELECT * FROM @condition WHERE holderCardProduct IS NOT NULL OR counterpartyCardProduct IS NOT NULL)
        AND OBJECT_ID('card.product', 'U') IS NULL
    BEGIN
        ;THROW 50000, 'rule.notPossibleToGetCardProduct', 1
    END
    ELSE IF (EXISTS (SELECT * FROM @condition WHERE holderCardProduct IS NOT NULL OR counterpartyCardProduct IS NOT NULL)
        AND OBJECT_ID('card.product', 'U') IS NOT NULL
    )
    BEGIN
        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'sc', p.productId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.holderCardProduct, ',') a
        LEFT JOIN [card].product p ON p.name = LTRIM(RTRIM(a.Value))
        WHERE c.holderCardProduct IS NOT NULL

        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'dc', p.productId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.counterpartyCardProduct, ',') a
        LEFT JOIN [card].product p ON p.name = LTRIM(RTRIM(a.Value))
        WHERE c.counterpartyCardProduct IS NOT NULL

        IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
            THROW 55555, 'rule.notExistingCardProductName', 1
    END

    IF EXISTS (SELECT * FROM @condition WHERE holderAccountProduct IS NOT NULL OR counterpartyAccountProduct IS NOT NULL)
        AND OBJECT_ID('ledger.product', 'U') IS NULL
    BEGIN
        ;THROW 55555, 'rule.notPossibleToGetAccountProduct', 1
    END
    ELSE IF (EXISTS (SELECT * FROM @condition WHERE holderAccountProduct IS NOT NULL OR counterpartyAccountProduct IS NOT NULL)
        AND OBJECT_ID('ledger.product', 'U') IS NOT NULL
    )
    BEGIN
        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'sc', p.itemNameId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.holderAccountProduct, ',') a
        LEFT JOIN ledger.product p ON p.name = LTRIM(RTRIM(a.Value))
        WHERE c.holderAccountProduct IS NOT NULL

        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'dc', p.itemNameId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.counterpartyAccountProduct, ',') a
        LEFT JOIN ledger.product p ON p.name = LTRIM(RTRIM(a.Value))
        WHERE c.counterpartyAccountProduct IS NOT NULL

        IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
            THROW 55555, 'rule.notExistingAccountProductName', 1
    END

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'sk', 'source.kyc', p.kycId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderKyc, ',') a
    LEFT JOIN customer.kyc p ON p.display = LTRIM(RTRIM(a.Value))
    WHERE c.holderKyc IS NOT NULL

    IF EXISTS (SELECT * FROM @conditionProperty WHERE [value] IS NULL)
        THROW 55555, 'rule.notExistingKYC', 1

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'dk', 'destination.kyc', p.kycId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyKyc, ',') a
    LEFT JOIN customer.kyc p ON p.display = LTRIM(RTRIM(a.Value))
    WHERE c.counterpartyKyc IS NOT NULL

    IF EXISTS (SELECT * FROM @conditionProperty WHERE [value] IS NULL)
        THROW 55555, 'rule.notExistingKYC', 1

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'st', 'source.customerType', p.customerTypeNumber
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderCustomerType, ',') a
    LEFT JOIN customer.customerType p ON p.customerTypeId = LTRIM(RTRIM(a.Value))
    WHERE c.holderCustomerType IS NOT NULL

    IF EXISTS (SELECT * FROM @conditionProperty WHERE [value] IS NULL)
        THROW 55555, 'rule.notExistingCustomerType', 1

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'dt', 'destination.customerType', p.customerTypeNumber
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyCustomerType, ',') a
    LEFT JOIN customer.customerType p ON p.customerTypeId = LTRIM(RTRIM(a.Value))
    WHERE c.counterpartyCustomerType IS NOT NULL

    IF EXISTS (SELECT * FROM @conditionProperty WHERE [value] IS NULL)
        THROW 55555, 'rule.notExistingCustomerType', 1

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT name, 'oc', [1], ISNULL([2], '1')
    FROM
    (
        SELECT r.name, c.operationTag, a.ItemNumber, a2.ItemNumber AS itn, LTRIM(RTRIM(a2.Value)) AS v
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.operationTag, ',') a
        CROSS APPLY core.DelimitedSplit8K(LTRIM(RTRIM(a.Value)), '=') a2
        WHERE c.operationTag IS NOT NULL
    ) p
    PIVOT
    (
        MAX(v)
        FOR itn IN ([1], [2])
    ) pivot_table

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT name, 'co', [1], ISNULL([2], '1')
    FROM
    (
        SELECT r.name, c.operationTag, a.ItemNumber, a2.ItemNumber AS itn, LTRIM(RTRIM(a2.Value)) AS v
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.channelOrganizationTag, ',') a
        CROSS APPLY core.DelimitedSplit8K(LTRIM(RTRIM(a.Value)), '=') a2
        WHERE c.channelOrganizationTag IS NOT NULL
    ) p
    PIVOT
    (
        MAX(v)
        FOR itn IN ([1], [2])
    ) pivot_table

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT name, 'so', [1], ISNULL([2], '1')
    FROM
    (
        SELECT r.name, c.operationTag, a.ItemNumber, a2.ItemNumber AS itn, LTRIM(RTRIM(a2.Value)) AS v
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.holderOrganizationTag, ',') a
        CROSS APPLY core.DelimitedSplit8K(LTRIM(RTRIM(a.Value)), '=') a2
        WHERE c.holderOrganizationTag IS NOT NULL
    ) p
    PIVOT
    (
        MAX(v)
        FOR itn IN ([1], [2])
    ) pivot_table

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT name, 'do', [1], ISNULL([2], '1')
    FROM
    (
        SELECT r.name, c.operationTag, a.ItemNumber, a2.ItemNumber AS itn, LTRIM(RTRIM(a2.Value)) AS v
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.counterpartyOrganizationTag, ',') a
        CROSS APPLY core.DelimitedSplit8K(LTRIM(RTRIM(a.Value)), '=') a2
        WHERE c.counterpartyOrganizationTag IS NOT NULL
    ) p
    PIVOT
    (
        MAX(v)
        FOR itn IN ([1], [2])
    ) pivot_table


    DECLARE @rules TABLE (ruleId INT, ruleName NVARCHAR(100))
    DECLARE @ruleSplitNames TABLE (splitId INT, splitNm NVARCHAR(100), ruleId INT, ruleName NVARCHAR(100))

    BEGIN TRANSACTION

        MERGE INTO [rule].condition AS t
        USING @conditionTT AS s ON 1 = 0
        WHEN NOT MATCHED BY TARGET THEN
            INSERT ([priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId,
                [name], [description], notes, createdOn, createdBy)
            VALUES (s.[priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId,
                [name], [description], notes, GETUTCDATE(), ISNULL(createdBy, @userId))
        OUTPUT INSERTED.conditionId, s.name INTO @rules(ruleId, ruleName);

        INSERT INTO [rule].conditionActor (conditionId, factor, actorId)
        SELECT ruleId, factor, actorId
        FROM @conditionActor
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].conditionItem (conditionId, factor, itemNameId)
        SELECT ruleId, factor, itemNameId
        FROM @conditionItem
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].conditionProperty (conditionId, factor, name, value)
        SELECT ruleId, factor, name, value
        FROM @conditionProperty
        JOIN @rules ON ruleName = conditionName

        INSERT INTO [rule].limit (conditionId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily,
            maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority])
        SELECT ruleId, currency, minAmount, maxAmount, maxAmountDaily, maxCountDaily,
            maxAmountWeekly, maxCountWeekly, maxAmountMonthly, maxCountMonthly, [credentials], [priority]
        FROM @limit
        JOIN @rules ON ruleName = conditionName

        MERGE INTO [rule].splitName AS t
        USING
        (
            SELECT ruleId, ruleName, ISNULL(s.name, 'fee') name, ISNULL(s.tag, '|fee|acquirer|') tag
            FROM @splitName s
            JOIN @rules ON conditionName = ruleName
        ) AS s ON 1 = 0
        WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, name, tag)
            VALUES (s.ruleId, s.name, s.tag)
        OUTPUT INSERTED.splitNameId, INSERTED.name, s.ruleId, s.ruleName INTO @ruleSplitNames(splitId, splitNm, ruleId, ruleName);

        INSERT [rule].splitRange (
            splitNameId,
            startAmountCurrency,
            startAmount,
            startAmountDaily,
            startCountDaily,
            startAmountWeekly,
            startCountWeekly,
            startAmountMonthly,
            startCountMonthly,
            isSourceAmount,
            minValue,
            maxValue,
            [percent],
            percentBase
        )
        SELECT
            n.splitId,
            ISNULL(r.startAmountCurrency, 'USD'),
            ISNULL(r.startAmount, 0),
            ISNULL(r.startAmountDaily, 0),
            ISNULL(r.startCountDaily, 0),
            ISNULL(r.startAmountWeekly, 0),
            ISNULL(r.startCountWeekly, 0),
            ISNULL(r.startAmountMonthly, 0),
            ISNULL(r.startCountMonthly, 0),
            ISNULL(r.isSourceAmount, 0),
            r.minValue,
            r.maxValue,
            r.[percent],
            r.percentBase
        FROM @splitRange r
        JOIN @ruleSplitNames n ON n.splitNm = ISNULL(r.splitName, 'fee') AND n.ruleName = r.conditionName

        INSERT [rule].splitAssignment (splitNameId, debit, credit, minValue, maxValue, [percent], description)
        SELECT n.splitId, ISNULL(r.debit, 'debit'), ISNULL(r.credit, 'credit'), r.minValue, r.maxValue, ISNULL(r.[percent], 100), COALESCE(r.description, r.splitName, 'fee')
        FROM @splitAssignment r
        JOIN @ruleSplitNames n ON n.splitNm = ISNULL(r.splitName, 'fee') AND n.ruleName = r.conditionName

        INSERT [rule].splitAnalytic(splitAssignmentId, [name], [value])
        SELECT a.splitAssignmentId, r.[name], r.[value]
        FROM @splitAnalytic r
        JOIN @ruleSplitNames n ON n.splitNm = ISNULL(r.splitName, 'fee') AND n.ruleName = r.conditionName
        JOIN [rule].splitAssignment a ON a.splitNameId = n.splitId AND r.splitAssignmentDescription = a.description

    COMMIT TRANSACTION

    EXEC core.auditCall @procid = @@PROCID, @params = @callParams
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    DECLARE @errmsg NVARCHAR(2048)
    SET @errmsg = error_message() + CHAR(10) + '    at ' + ISNULL(OBJECT_SCHEMA_NAME(@@PROCID, DB_ID()) + '.' + OBJECT_NAME(@@PROCID, DB_ID()), '<SQL>') +
        ' (line:' + LTRIM(STR(ISNULL(error_line(), 1))) + ') errno:' + LTRIM(STR(ISNULL(error_number(), 0)))

    EXEC [core].[errorCall] @procId = @@PROCID, @params = @callParams, @error = @errmsg

    ;THROW;
END CATCH
