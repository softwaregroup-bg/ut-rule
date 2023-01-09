IF OBJECT_ID('ledger.account', 'U') IS NOT NULL
BEGIN
    DECLARE @condition [rule].conditionTT
    DECLARE @conditionActor [rule].conditionActorTT
    DECLARE @conditionItem [rule].conditionItemTT
    DECLARE @conditionProperty [rule].conditionPropertyTT
    DECLARE @limit [rule].limitTT
    DECLARE @split XML
    DECLARE @meta core.metaDataTT
    DECLARE @sa BIGINT = (SELECT actorId FROM [user].[hash] WHERE identifier = 0x00 /*encryptStable sa*/ AND [type] = 'password')
    INSERT INTO @meta([auth.actorId], [method]) VALUES(@sa, 'rule.rule.add')
    DECLARE @currency VARCHAR(3) = CASE LEN('${utLedger.sqlStandard.defaultCurrency}')
        WHEN 3 THEN '${utLedger.sqlStandard.defaultCurrency}'
        ELSE 'USD'
    END

    DECLARE @selfRegistrationProductId BIGINT,
        @selfRegistrationItemNameId BIGINT,
        @selfRegistrationSuffix VARCHAR(20),
        @erpProductId BIGINT,
        @erpItemNameId BIGINT,
        @erpSuffix VARCHAR(20)

    SELECT
        @selfRegistrationProductId = productId,
        @selfRegistrationItemNameId = itemNameId
    FROM [ledger].[product]
    WHERE [name] = 'selfRegistration'

    SELECT
        @erpProductId = productId,
        @erpItemNameId = itemNameId
    FROM [ledger].[product]
    WHERE [name] = 'ERP GL Product'

    IF EXISTS(SELECT 1 FROM [ledger].[productSubAccountType] WHERE productId = @selfRegistrationProductId)
        SET @selfRegistrationSuffix = 'available'
    IF EXISTS(SELECT 1 FROM [ledger].[productSubAccountType] WHERE productId = @erpProductId)
        SET @erpSuffix = 'available'


    SET @selfRegistrationSuffix = ISNULL(@selfRegistrationSuffix, '')
    SET @erpSuffix = ISNULL(@erpSuffix, '')

    IF NOT EXISTS (SELECT * FROM [rule].condition WHERE name = 'Test wallet pending payments')
    BEGIN
        INSERT INTO @condition ([name], [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
        VALUES ('Test wallet pending payments', 10, NULL, NULL, NULL, NULL)

        INSERT INTO @conditionItem (factor, itemNameId)
        SELECT 'oc', itemNameId
        FROM core.itemName cin
        JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
        WHERE cit.alias = 'operation' AND itemCode IN ('walletToWallet', 'requestMoney', 'qrPayment', 'adjustment', 'adjustmentDebit', 'adjustmentCredit')
        UNION ALL
        SELECT 'dc', @selfRegistrationItemNameId
        UNION ALL
        SELECT 'sc', @selfRegistrationItemNameId

        SET @split = N'<data>
            <rows>
                <splitName>
                    <name>wallet pending payments</name>
                    <tag>pending</tag>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>' + @currency + '</startAmountCurrency>
                    <percent>100</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>$' + '{source.account.number}' + @selfRegistrationSuffix + N'</debit>
                    <credit>$' + '{destination.account.number}' + @selfRegistrationSuffix + N'</credit>
                    <percent>100</percent>
                    <description>wallet pending payments</description>
                </splitAssignment>
            </rows>
        </data>'

        EXEC [rule].[rule.add]
            @condition,
            @conditionActor,
            @conditionItem,
            @conditionProperty,
            @limit,
            @split,
            @meta
    END

    DELETE FROM @condition
    DELETE FROM @conditionItem

    IF NOT EXISTS (SELECT * FROM [rule].condition WHERE name = 'Test wallet push transfers')
    BEGIN
        INSERT INTO @condition ([name], [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
        VALUES ('Test wallet push transfers', 11, NULL, NULL, NULL, NULL)

        INSERT INTO @conditionItem (factor, itemNameId)
        SELECT 'oc', itemNameId
        FROM core.itemName cin
        JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
        WHERE cit.alias = 'operation' AND itemCode IN ('refund')
        UNION ALL
        SELECT 'dc', @selfRegistrationItemNameId

        SET @split = N'<data>
            <rows>
                <splitName>
                    <name>wallet push transfers</name>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>' + @currency + '</startAmountCurrency>
                    <percent>100</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>$' + '{source.account.number}</debit>
                    <credit>$' + '{destination.account.number}' + @selfRegistrationSuffix + N'</credit>
                    <percent>100</percent>
                    <description>wallet push transfers</description>
                </splitAssignment>
            </rows>
        </data>'

        EXEC [rule].[rule.add]
            @condition,
            @conditionActor,
            @conditionItem,
            @conditionProperty,
            @limit,
            @split,
            @meta
    END

    DELETE FROM @condition
    DELETE FROM @conditionItem

    IF NOT EXISTS (SELECT * FROM [rule].condition WHERE name = 'Test wallet to account')
    BEGIN
        DECLARE @accountNumber VARCHAR(35) = (SELECT accountNumber FROM [ledger].[account] WHERE accountName = 'CBS GL')

        INSERT INTO @condition ([name], [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
        VALUES ('Test wallet to account', 12, NULL, NULL, NULL, NULL)

        INSERT INTO @conditionItem (factor, itemNameId)
        SELECT 'oc', itemNameId
        FROM core.itemName cin
        JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
        WHERE cit.alias = 'operation' AND itemCode IN ('walletToAccount')
        UNION ALL
        SELECT 'sc', @selfRegistrationItemNameId

        SET @split = N'<data>
            <rows>
                <splitName>
                    <name>Wallet To Account</name>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>' + @currency + '</startAmountCurrency>
                    <percent>100</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>$' + '{source.account.number}' + @selfRegistrationSuffix + N'</debit>
                    <credit>' + @accountNumber + N'</credit>
                    <percent>100</percent>
                    <description>Wallet To Account</description>
                </splitAssignment>
            </rows>
        </data>'

        EXEC [rule].[rule.add]
            @condition,
            @conditionActor,
            @conditionItem,
            @conditionProperty,
            @limit,
            @split,
            @meta
    END

    DELETE FROM @condition
    DELETE FROM @conditionItem

    IF NOT EXISTS (SELECT * FROM [rule].condition WHERE name = 'Test wallet pending erp payments') AND @erpItemNameId IS NOT NULL
    BEGIN
        INSERT INTO @condition ([name], [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
        VALUES ('Test wallet pending erp payments', 13, NULL, NULL, NULL, NULL)

        INSERT INTO @conditionItem (factor, itemNameId)
        SELECT 'oc', itemNameId
        FROM core.itemName cin
        JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
        WHERE cit.alias = 'operation' AND itemCode IN ('walletToWallet', 'requestMoney', 'qrPayment')
        UNION ALL
        SELECT 'dc', @erpItemNameId
        UNION ALL
        SELECT 'sc', @selfRegistrationItemNameId

        SET @split = N'<data>
            <rows>
                <splitName>
                    <name>wallet pending erp payments</name>
                    <tag>pending</tag>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>' + @currency + '</startAmountCurrency>
                    <percent>100</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>$' + '{source.account.number}' + @selfRegistrationSuffix + N'</debit>
                    <credit>$' + '{destination.account.number}' + @erpSuffix + N'</credit>
                    <percent>100</percent>
                    <description>wallet pending erp payments</description>
                </splitAssignment>
            </rows>
        </data>'

        EXEC [rule].[rule.add]
            @condition,
            @conditionActor,
            @conditionItem,
            @conditionProperty,
            @limit,
            @split,
            @meta
    END
END
