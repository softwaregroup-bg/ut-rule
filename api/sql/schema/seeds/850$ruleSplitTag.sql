DECLARE @itemTypeId INT
SET @itemTypeId = ( SELECT itemTypeId FROM core.itemType WHERE alias = 'ruleSplitTag')

IF @itemTypeId IS NULL
BEGIN
    INSERT INTO core.itemType (alias, name, [description], [table], keyColumn, nameColumn)
    VALUES('ruleSplitTag', 'ruleSplitTag', 'Split Tags in Rule module', NULL, NULL, NULL)
    
    SET @itemTypeId = SCOPE_IDENTITY();
END


MERGE INTO
    core.itemName AS target
USING
    (VALUES
        ('acquirer','Acquirer'),
        ('issuer','Issuer'),
        ('commission','Commission'),
        ('realtime','Realtime posting'),
        ('pending','Authorization required'),
        ('agent','Agent'),
        ('fee','Fee'),
        ('atm', 'ATM'),
        ('pos', 'POS'),
        ('ped', 'PED')
    ) AS source (itemCode, itemName)
JOIN
	core.itemType t on t.alias='ruleSplitTag'
ON
    target.itemCode = source.itemCode
WHEN
    NOT MATCHED BY TARGET THEN
INSERT
    (itemTypeId, itemCode, itemName)
VALUES
    (t.itemTypeId, source.itemCode, source.itemName);