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
    SELECT co.priority, co. operationStartDate, co. operationEndDate, co. sourceAccountId, co. destinationAccountId,
        co.name, co.description, co.notes, co.createdBy
    FROM @condition co
    LEFT JOIN [rule].condition c ON (c.name = co.name OR c.priority = co.priority)
    WHERE c.priority IS NULL

    INSERT INTO @conditionActor(conditionName, factor, actorId)
    SELECT r.name, 'co', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.channelOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))
    UNION ALL
    SELECT r.name, 'so', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))
    UNION ALL
    SELECT r.name, 'do', o.actorId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyOrganization, ',') a
    LEFT JOIN customer.organization o ON o.organizationName = LTRIM(RTRIM(a.Value))

    IF EXISTS (SELECT * FROM @conditionActor WHERE actorid IS NULL)
        THROW 55555, 'rule.notExistingOrganizationName', 1


    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'oc', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.operation, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'operation')

    IF EXISTS (SELECT * FROM @conditionActor WHERE actorid IS NULL)
        THROW 55555, 'rule.notExistingOperationName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.channelCountry, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'country')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderCountry, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'country')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyCountry, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'country')

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingCountryName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.channelRegion, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'region')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderRegion, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'region')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyRegion, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'region')

    IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
        THROW 55555, 'rule.notExistingRegionName', 1

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'cs', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.channelCity, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'city')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ss', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderCity, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'city')

    INSERT INTO @conditionItem(conditionName, factor, itemNameId)
    SELECT r.name, 'ds', i.itemNameId
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyCity, ',') a
    LEFT JOIN core.itemName i ON i.itemName = LTRIM(RTRIM(a.Value))
        AND i.itemTypeId = (SELECT i.itemTypeId FROM core.itemType WHERE alias = 'city')

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

        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'dc', p.productId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.counterpartyCardProduct, ',') a
        LEFT JOIN [card].product p ON p.name = LTRIM(RTRIM(a.Value))

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

        INSERT INTO @conditionItem(conditionName, factor, itemNameId)
        SELECT r.name, 'dc', p.itemNameId
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.counterpartyAccountProduct, ',') a
        LEFT JOIN ledger.product p ON p.name = LTRIM(RTRIM(a.Value))

        IF EXISTS (SELECT * FROM @conditionItem WHERE itemNameId IS NULL)
            THROW 55555, 'rule.notExistingAccountProductName', 1
    END

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'sk', 'holder.kyc', LTRIM(RTRIM(a.Value))
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderKyc, ',') a

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'dk', 'counterparty.kyc', LTRIM(RTRIM(a.Value))
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyKyc, ',') a

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'st', 'holder.customerType', LTRIM(RTRIM(a.Value))
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.holderCustomerType, ',') a

    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT r.name, 'dt', 'counterparty.customerType', LTRIM(RTRIM(a.Value))
    FROM @condition c
    JOIN @conditionTT r ON r.name = c.name
    CROSS APPLY core.DelimitedSplit8K(c.counterpartyCustomerType, ',') a


    INSERT INTO @conditionProperty(conditionName, factor, name, value)
    SELECT name, 'oc', [1], ISNULL([2], '1')
    FROM
    (
        SELECT r.name, c.operationTag, a.ItemNumber, a2.ItemNumber AS itn, LTRIM(RTRIM(a2.Value)) AS v
        FROM @condition c
        JOIN @conditionTT r ON r.name = c.name
        CROSS APPLY core.DelimitedSplit8K(c.operationTag, ',') a
        CROSS APPLY core.DelimitedSplit8K(LTRIM(RTRIM(a.Value)), '=') a2
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
            SELECT ruleId, ruleName, s.name, s.tag
            FROM @splitName s
            JOIN @rules ON conditionName = ruleName
        ) AS s ON 1 = 0
        WHEN NOT MATCHED BY TARGET THEN
            INSERT (conditionId, name, tag)
            VALUES (s.ruleId, s.name, s.tag)
        OUTPUT INSERTED.splitNameId, INSERTED.name, s.ruleId, s.ruleName INTO @ruleSplitNames(splitId, splitNm, ruleId, ruleName);

        INSERT [rule].splitRange (splitNameId, startAmount, startAmountCurrency, startAmountDaily, startCountDaily,
            startAmountWeekly, startCountWeekly, startAmountMonthly, startCountMonthly,
            isSourceAmount, minValue, maxValue, [percent], percentBase)
        SELECT n.splitId, r.startAmount, r.startAmountCurrency, r.startAmountDaily, r.startCountDaily,
            r.startAmountWeekly, r.startCountWeekly, r.startAmountMonthly, r.startCountMonthly,
            r.isSourceAmount, r.minValue, r.maxValue, r.[percent], r.percentBase
        FROM @splitRange r
        JOIN @ruleSplitNames n ON n.splitNm = r.splitName AND n.ruleName = r.conditionName

        INSERT [rule].splitAssignment (splitNameId, debit, credit, minValue, maxValue, [percent], description)
        SELECT n.splitId, r.debit, r.credit, r.minValue, r.maxValue, r.[percent], r.description
        FROM @splitAssignment r
        JOIN @ruleSplitNames n ON n.splitNm = r.splitName AND n.ruleName = r.conditionName

        INSERT [rule].splitAnalytic(splitAssignmentId, [name], [value])
        SELECT a.splitAssignmentId, r.[name], r.[value]
        FROM @splitAnalytic r
        JOIN @ruleSplitNames n ON n.splitNm = r.splitName AND n.ruleName = r.conditionName
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
