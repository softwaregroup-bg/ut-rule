MERGE INTO [user].[actionCategory] AS target
USING
    (VALUES
        ('rule', NULL, NULL, NULL)
    ) AS source (name, [table], keyColumn, displayColumn)
ON target.name = source.name
WHEN NOT MATCHED BY TARGET THEN
INSERT (name, [table], keyColumn, displayColumn)
VALUES (name, [table], keyColumn, displayColumn);

DECLARE @ruleActionCategoryId INT = (SELECT actionCategoryId FROM [user].[actionCategory] WHERE name = 'rule')

MERGE INTO [user].[action] AS target
USING
    (VALUES
        ('rule.decision.lookup', @ruleActionCategoryId, 'rule decision lookup', N'{}'),
        ('rule.item.fetch', @ruleActionCategoryId, 'rule item fetch', N'{}'),
        ('rule.rule.add', @ruleActionCategoryId, 'rule add', N'{}'),
        ('rule.rule.edit', @ruleActionCategoryId, 'rule edit', N'{}'),
        ('rule.rule.fetch', @ruleActionCategoryId, 'rule fetch', N'{}'),
        ('rule.rule.fetchDeleted', @ruleActionCategoryId, 'deleted rule fetch', N'{}'),
        ('rule.rule.nav', @ruleActionCategoryId, 'Access to Rule tab', N'{}'),
        ('rule.rule.remove', @ruleActionCategoryId, 'rule remove', N'{}')
    ) AS source (actionId, actionCategoryId, [description], valueMap)
ON target.actionId = source.actionId
WHEN MATCHED AND target.[description] <> source.[description] THEN
    UPDATE SET target.[description] = source.[description]
WHEN NOT MATCHED BY TARGET THEN
    INSERT (actionId, actionCategoryId, [description], valueMap)
    VALUES (actionId, actionCategoryId, [description], valueMap);
