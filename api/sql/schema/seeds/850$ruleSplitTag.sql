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
        ('merchant', 'Merchant'),
        ('atm', 'ATM'),
        ('pos', 'POS'),
        ('ped', 'PED')
    ) AS source (itemCode, itemName)
JOIN
	core.itemType t ON t.alias='ruleSplitTag'
ON
    target.itemCode = source.itemCode AND target.itemTypeId = t.itemTypeId 
WHEN
    NOT MATCHED BY TARGET THEN
INSERT
    (itemTypeId, itemCode, itemName)
VALUES
    (t.itemTypeId, source.itemCode, source.itemName);

/*******************************Trnaslation***********************************************/
DECLARE @itemNameTranslationTT core.itemNameTranslationTT
DECLARE @languageId BIGINT = (SELECT languageId FROM core.language WHERE iso2Code = 'en')

INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Acquirer', 'acquirer', N'Acquirer')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Issuer', 'issuer',N'Issuer')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Commission', 'commission',N'Commission')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Realtime posting', 'realtime',N'Realtime posting')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Authorization required', 'pending',N'Authorization required')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Agent', 'agent',N'Agent')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Fee', 'fee', N'Fee')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'Merchant', 'merchant', N'Merchant')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'ATM', 'atm', N'ATM')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'POS', 'pos', N'POS')
INSERT INTO @itemNameTranslationTT(itemSyncId, itemName, itemCode, itemNameTranslation) VALUES (NULL, 'PED', 'ped', N'PED')

MERGE [core].[itemTranslation] AS t
USING
(
    SELECT @languageid, r.itemNameId, tt.itemNameTranslation
    FROM @itemNameTranslationTT tt
    JOIN core.itemName r 
        ON r.itemcode = tt.itemCode AND r.itemTypeId = @itemTypeId
) AS s (languageId, itemNameId , itemNameTranslation)
ON (t.languageId = s.languageId and t.itemNameId = s.itemNameId )
WHEN MATCHED THEN
UPDATE 
    SET itemNameTranslation = s.itemNameTranslation
WHEN NOT MATCHED BY TARGET THEN
    INSERT (languageId, itemNameId, itemNameTranslation)
    VALUES (s.languageId, s.itemNameId, s.itemNameTranslation);