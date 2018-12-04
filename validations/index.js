module.exports = function validation() {
    return {rule: {
        'decision.fetch': () => require('./decision/decision.fetch'),
        'decision.lookup': () => require('./decision/decision.lookup'),

        'item.fetch': () => require('./item/item.fetch'),
        'rule.fetch': () => require('./rule/rule.fetch'),
        'rule.fetchDeleted': () => require('./rule/rule.fetch'),
        'rule.add': () => require('./rule/rule.add'),
        'rule.remove': () => require('./rule/rule.remove'),
        'rule.edit': () => require('./rule/rule.edit'),
        'limitForUserByRole.get': () => require('./rule/rule.limitforuserbyrole.get')
    }};
};
