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

    IF NOT EXISTS (SELECT * FROM [rule].condition WHERE name = 'Test bill payment')
    BEGIN
        INSERT INTO @condition ([name], [priority], operationStartDate, operationEndDate, sourceAccountId, destinationAccountId)
        VALUES ('Test bill payment', 100, NULL, NULL, NULL, NULL)

        INSERT INTO @conditionItem (factor, itemNameId)
        SELECT 'oc', itemNameId
        FROM core.itemName cin
        JOIN core.itemType cit ON cit.itemTypeId = cin.itemTypeId
        WHERE cit.alias = 'operation' AND itemCode = 'bill'

        SET @split = N'<data>
            <rows>
                <splitName>
                    <name>bill payment</name>
                    <tag>|realtime|</tag>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>USD</startAmountCurrency>
                    <percent>100</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>merchant_pool</debit>
                    <credit>${destination.account.number}</credit>
                    <percent>100</percent>
                    <description>bill payment</description>
                </splitAssignment>
            </rows>
            <rows>
                <splitName>
                    <name>bill payment fee</name>
                    <tag>|processor|fee|</tag>
                </splitName>
                <splitRange>
                    <startAmount>0</startAmount>
                    <startAmountCurrency>USD</startAmountCurrency>
                    <minValue>0.25</minValue>
                    <maxValue>10</maxValue>
                    <percent>0.08</percent>
                    <isSourceAmount>0</isSourceAmount>
                </splitRange>
                <splitAssignment>
                    <debit>${destination.account.number}</debit>
                    <credit>merchant_tax</credit>
                    <percent>100</percent>
                    <description>bill payment fee</description>
                </splitAssignment>
            </rows>
        </data>'

        EXEC [rule].[rule.add]
            @condition = @condition,
            @conditionActor = @conditionActor,
            @conditionItem = @conditionItem,
            @conditionProperty = @conditionProperty,
            @limit = @limit,
            @split = @split,
            @meta = @meta
    END
END
