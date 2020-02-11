DECLARE @itemTypeId BIGINT
-- region
SET @itemTypeId = (SELECT itemTypeId FROM [core].itemType WHERE name = 'region')
IF @itemTypeId IS NULL
BEGIN
    INSERT INTO [core].itemType([alias], [name], [description], [table], [keyColumn], [nameColumn])
    VALUES ('region', 'region', 'region', 'region', 'regionId', 'regionId')
    SET @itemTypeId = SCOPE_IDENTITY()
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'West' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'West', 'West', NULL, NULL, 1, NULL)
END
-- city
SET @itemTypeId = (SELECT itemTypeId FROM [core].itemType WHERE name = 'city')
IF @itemTypeId IS NULL
BEGIN
    INSERT INTO [core].itemType([alias], [name], [description], [table], [keyColumn], [nameColumn])
    VALUES ('city', 'city', 'city', 'city', 'cityId', 'cityId')
    SET @itemTypeId = SCOPE_IDENTITY()
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'Seattle' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'Seattle', 'Seattle', NULL, NULL, 1, NULL)
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'Redmond' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'Redmond', 'Redmond', NULL, NULL, 1, NULL)
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'San Francisco' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'San Francisco', 'San Francisco', NULL, NULL, 1, NULL)
END
-- channel
SET @itemTypeId = (SELECT itemTypeId FROM [core].itemType WHERE name = 'channel')
IF @itemTypeId IS NULL
BEGIN
    INSERT INTO [core].itemType([alias], [name], [description], [table], [keyColumn], [nameColumn])
    VALUES ('channel', 'channel', 'channel', 'channel', 'channelId', 'channelId')
    SET @itemTypeId = SCOPE_IDENTITY()
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'USSD / SMS' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'USSD / SMS', 'USSD / SMS', NULL, NULL, 1, NULL)
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'Self service app' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'Self service app', 'Self service app', NULL, NULL, 1, NULL)
END
IF NOT EXISTS (SELECT 1 FROM [core].itemName WHERE itemName = 'Third Party' AND itemTypeId = @itemTypeId)
BEGIN
    INSERT INTO [core].itemName([itemTypeId], [itemName], [itemCode], [itemSyncId], [organizationId], [isEnabled], [itemOrder])
    VALUES (@itemTypeId, 'Third Party', 'Third Party', NULL, NULL, 1, NULL)
END
