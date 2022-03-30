DECLARE @condition [rule].conditionTT
DECLARE @conditionActor [rule].conditionActorTT
DECLARE @conditionItem [rule].conditionItemTT
DECLARE @conditionProperty [rule].conditionPropertyTT
DECLARE @limit [rule].limitTT
DECLARE @split XML
DECLARE @currency VARCHAR(3) = CASE LEN('${utLedger.sqlStandard.defaultCurrency}')
    WHEN 3 THEN '${utLedger.sqlStandard.defaultCurrency}'
    ELSE 'USD'
END

DECLARE @selfRegistrationProductId BIGINT,
    @selfRegistrationItemNameId BIGINT,
    @suffix VARCHAR(20)
SELECT
    @selfRegistrationProductId = productId,
    @selfRegistrationItemNameId = itemNameId
FROM [ledger].[product]
WHERE [name] = 'selfRegistration'

IF EXISTS(SELECT 1 FROM [ledger].[productSubAccountType] WHERE productId = @selfRegistrationProductId)
    SET @suffix = 'available'

SET @suffix = ISNULL(@suffix, '')

IF NOT EXISTS (SELECT * FROM [rule].condition WHERE [priority] = 10)
BEGIN
    INSERT INTO @condition ([priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
    VALUES (10, NULL, NULL, NULL, NULL)

    INSERT INTO @conditionItem (factor, itemNameId)
    SELECT 'oc', itemNameId
    FROM core.itemName cin
    JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
    WHERE cit.alias = 'operation' AND itemCode IN ('walletToWallet', 'requestMoney', 'qrPayment')
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
                <debit>$' + '{source.account.number}' + @suffix + N'</debit>
                <credit>$' + '{destination.account.number}' + @suffix + N'</credit>
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
        @split
END

DELETE FROM @condition
DELETE FROM @conditionItem

IF NOT EXISTS (SELECT * FROM [rule].condition WHERE [priority] = 11)
BEGIN
    INSERT INTO @condition ([priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
    VALUES (11, NULL, NULL, NULL, NULL)

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
                <credit>$' + '{destination.account.number}' + @suffix + N'</credit>
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
        @split
END

DELETE FROM @condition
DELETE FROM @conditionItem

IF NOT EXISTS (SELECT * FROM [rule].condition WHERE [priority] = 12)
BEGIN
    DECLARE @accountNumber VARCHAR(35) = (SELECT accountNumber FROM [ledger].[account] WHERE accountName = 'CBS GL')

    INSERT INTO @condition ([priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
    VALUES (12, NULL, NULL, NULL, NULL)

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
                <debit>$' + '{source.account.number}' + @suffix + N'</debit>
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
        @split
END
