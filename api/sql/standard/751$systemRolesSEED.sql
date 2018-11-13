DECLARE @itemNameTranslationTT core.itemNameTranslationTT
DECLARE @meta core.metaDataTT
DECLARE @enLanguageId [tinyint] = (SELECT languageId FROM [core].[language] WHERE iso2Code = 'en');

INSERT INTO @itemNameTranslationTT(itemCode, itemName, itemNameTranslation) VALUES ('rule', 'Rule Management', 'Rule Management')

EXEC core.[itemNameTranslation.upload] @itemNameTranslationTT = @itemNameTranslationTT,
    @languageId = @enLanguageId, @organizationId = NULL, @itemType = 'roleCategory', @meta = @meta

DECLARE @rulesId BIGINT = (SELECT itemNameId FROM [core].[itemName] i JOIN [core].[itemType] it ON i.itemTypeId = it.itemTypeId WHERE it.[name] = 'roleCategory' AND itemCode = 'rule')

DECLARE @rulesList BIGINT, @rulesAdd BIGINT, @rulesEdit BIGINT, @rulesDelete BIGINT

--View Rules
IF NOT EXISTS(SELECT * FROM [user].[role] WHERE name = 'List Rules')
BEGIN
    INSERT INTO core.actor(actorType, isEnabled) VALUES('role', 1)
    SET @rulesList = SCOPE_IDENTITY()
    INSERT INTO [user].[role](actorId, name, [description], isEnabled, isDeleted, fieldOfWorkId, isSystem)
    VALUES(@rulesList, 'List Rules', 'List Rules', 1, 0, @rulesId, 1)
END
ELSE
    SET @rulesList = (SELECT actorId FROM [user].[role] WHERE name = 'List Rules')

MERGE INTO [user].actorAction AS target
USING
    (VALUES
        (@rulesList, 'rule.rule.nav', '%', 1),
        (@rulesList, 'customer.organization.graphFetch', '%', 1),
        (@rulesList, 'customer.organization.list', '%', 1),
        (@rulesList, 'rule.rule.fetch', '%', 1),
        (@rulesList, 'rule.item.fetch', '%', 1),
        (@rulesList, 'core.itemName.fetch', '%', 1),
        (@rulesList, 'core.itemCode.fetch', '%', 1),
        (@rulesList, 'customer.organization.fetch', '%', 1),
        (@rulesList, 'user.role.fetch', '%', 1)
    ) AS source (actorId, actionId, objectId, [level])
ON target.actorId = source.actorId AND target.actionId = source.actionId AND target.objectId = source.objectId AND target.[level] = source.[level]
WHEN NOT MATCHED BY TARGET THEN
INSERT (actorId, actionId, objectId, [level])
VALUES (actorId, actionId, objectId, [level]);

--Create Rule
IF NOT EXISTS(SELECT * FROM [user].[role] WHERE name = 'Create Rule')
BEGIN
    INSERT INTO core.actor(actorType, isEnabled) VALUES('role', 1)
    SET @rulesAdd = SCOPE_IDENTITY()
    INSERT INTO [user].[role](actorId, name, [description], isEnabled, isDeleted, fieldOfWorkId, isSystem)
    VALUES(@rulesAdd, 'Create Rule', 'Create Rule', 1, 0, @rulesId, 1)
END
ELSE
    SET @rulesAdd = (SELECT actorId FROM [user].[role] WHERE name = 'Create Rule')

MERGE INTO [user].actorAction AS target
USING
    (VALUES
        (@rulesAdd, 'rule.rule.nav', '%', 1),
        (@rulesAdd, 'customer.organization.graphFetch', '%', 1),
        (@rulesAdd, 'customer.organization.list', '%', 1),
        (@rulesAdd, 'rule.rule.fetch', '%', 1),
        (@rulesAdd, 'rule.rule.add', '%', 1),
        (@rulesAdd, 'rule.item.fetch', '%', 1),
        (@rulesAdd, 'core.itemName.fetch', '%', 1),
        (@rulesAdd, 'core.itemCode.fetch', '%', 1),
        (@rulesAdd, 'customer.organization.fetch', '%', 1),
        (@rulesAdd, 'user.role.fetch', '%', 1)
    ) AS source (actorId, actionId, objectId, [level])
ON target.actorId = source.actorId AND target.actionId = source.actionId AND target.objectId = source.objectId AND target.[level] = source.[level]
WHEN NOT MATCHED BY TARGET THEN
INSERT (actorId, actionId, objectId, [level])
VALUES (actorId, actionId, objectId, [level]);

--Edit Rule
IF NOT EXISTS(SELECT * FROM [user].[role] WHERE name = 'Edit Rule')
BEGIN
    INSERT INTO core.actor(actorType, isEnabled) VALUES('role', 1)
    SET @rulesEdit = SCOPE_IDENTITY()
    INSERT INTO [user].[role](actorId, name, [description], isEnabled, isDeleted, fieldOfWorkId, isSystem)
    VALUES(@rulesEdit, 'Edit Rule', 'Edit Rule', 1, 0, @rulesId, 1)
END
ELSE
    SET @rulesEdit = (SELECT actorId FROM [user].[role] WHERE name = 'Edit Rule')

MERGE INTO [user].actorAction AS target
USING
    (VALUES
        (@rulesEdit, 'rule.rule.nav', '%', 1),
        (@rulesEdit, 'customer.organization.graphFetch', '%', 1),
        (@rulesEdit, 'customer.organization.list', '%', 1),
        (@rulesEdit, 'rule.rule.fetch', '%', 1),
        (@rulesEdit, 'rule.item.fetch', '%', 1),
        (@rulesEdit, 'core.itemName.fetch', '%', 1),
        (@rulesEdit, 'core.itemCode.fetch', '%', 1),
        (@rulesEdit, 'customer.organization.fetch', '%', 1),
        (@rulesEdit, 'user.role.fetch', '%', 1),
        (@rulesEdit, 'rule.rule.edit', '%', 1)
    ) AS source (actorId, actionId, objectId, [level])
ON target.actorId = source.actorId AND target.actionId = source.actionId AND target.objectId = source.objectId AND target.[level] = source.[level]
WHEN NOT MATCHED BY TARGET THEN
INSERT (actorId, actionId, objectId, [level])
VALUES (actorId, actionId, objectId, [level]);

--Delete Rule
IF NOT EXISTS(SELECT * FROM [user].[role] WHERE name = 'Delete Rule')
BEGIN
    INSERT INTO core.actor(actorType, isEnabled) VALUES('role', 1)
    SET @rulesDelete = SCOPE_IDENTITY()
    INSERT INTO [user].[role](actorId, name, [description], isEnabled, isDeleted, fieldOfWorkId, isSystem)
    VALUES(@rulesDelete, 'Delete Rule', 'Delete Rule', 1, 0, @rulesId, 1)
END
ELSE
    SET @rulesDelete = (SELECT actorId FROM [user].[role] WHERE name = 'Delete Rule')

MERGE INTO [user].actorAction AS target
USING
    (VALUES
        (@rulesDelete, 'rule.rule.nav', '%', 1),
        (@rulesDelete, 'customer.organization.graphFetch', '%', 1),
        (@rulesDelete, 'customer.organization.list', '%', 1),
        (@rulesDelete, 'rule.rule.fetch', '%', 1),
        (@rulesDelete, 'rule.item.fetch', '%', 1),
        (@rulesDelete, 'core.itemName.fetch', '%', 1),
        (@rulesDelete, 'core.itemCode.fetch', '%', 1),
        (@rulesDelete, 'customer.organization.fetch', '%', 1),
        (@rulesDelete, 'user.role.fetch', '%', 1),
        (@rulesDelete, 'rule.rule.remove', '%', 1)
    ) AS source (actorId, actionId, objectId, [level])
ON target.actorId = source.actorId AND target.actionId = source.actionId AND target.objectId = source.objectId AND target.[level] = source.[level]
WHEN NOT MATCHED BY TARGET THEN
INSERT (actorId, actionId, objectId, [level])
VALUES (actorId, actionId, objectId, [level]);
