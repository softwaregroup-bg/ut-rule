MERGE INTO
    [user].[actionCategory] as target
USING
    (VALUES
        ('rule')
    ) AS source (name)
ON
    target.name=source.name
WHEN NOT MATCHED BY TARGET THEN
INSERT
    ([name])
VALUES
    (source.[name]);

MERGE INTO
    [user].[action] as target
USING
    (VALUES
        ('rule.decision.fetch', 'rule.decision.fetch', '{}'),
        ('rule.operation.lookup', 'rule.operation.lookup', '{}'),
        ('rule.rule.add', 'rule.rule.add', '{}'),
        ('rule.rule.edit', 'rule.rule.edit', '{}'),
        ('rule.rule.fetch', 'rule.rule.fetch', '{}'),
        ('rule.rule.remove', 'rule.rule.remove', '{}'),
        ('rule.item.fetch', 'rule.item.fetch', '{}')
    ) AS source (actionId, description, valueMap)
JOIN
    [user].[actionCategory] c ON c.name = 'rule'
ON
    target.actionId=source.actionId
WHEN NOT MATCHED BY TARGET THEN
INSERT
    ([actionId], [actionCategoryId], [description], [valueMap])
VALUES
    (source.[actionId], c.[actionCategoryId], source.[description], source.[valueMap]);
