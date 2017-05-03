 DECLARE @ruleActionCategoryId INT = (SELECT actionCategoryId FROM [user].[actionCategory] WHERE name = 'rule')

if @ruleActionCategoryId is null
begin
    insert into [user].[actionCategory](name)
    values ('rule')

    set @ruleActionCategoryId = SCOPE_IDENTITY()
end

declare @action [user].[actionTT]

insert into @action ([actionId], [actionCategoryId], [description], [valueMap])

VALUES ('rule.decision.fetch', @ruleActionCategoryId, 'rule.decision.fetch', '{}')
    ,('rule.operation.lookup', @ruleActionCategoryId, 'rule.operation.lookup', '{}')
    ,('rule.rule.add', @ruleActionCategoryId, 'rule.rule.add', '{}')
    ,('rule.rule.edit', @ruleActionCategoryId, 'rule.rule.edit', '{}')
    ,('rule.rule.fetch', @ruleActionCategoryId, 'rule.rule.fetch', '{}')
    ,('rule.rule.remove', @ruleActionCategoryId, 'rule.rule.remove', '{}')
    ,('rule.item.fetch', @ruleActionCategoryId, 'rule.item.fetch', '{}')

;MERGE into [user].[action] as dd
using
(
    select [actionId], [actionCategoryId], [description], [valueMap]
    from @action
) d on dd.actionId=d.actionId

WHEN NOT MATCHED BY TARGET THEN
    INSERT ([actionId], [actionCategoryId], [description], [valueMap])
    VALUES ([actionId], [actionCategoryId], [description], [valueMap]);
