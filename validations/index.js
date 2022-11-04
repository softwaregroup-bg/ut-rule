// @ts-check
/** @type { import("ut-run").validationSet } */
module.exports = function validation() {
    return [
        require('ut-function.common-joi'),
        require('./decision/rule.decision.fetch'),
        require('./decision/rule.decision.lookup'),
        require('./item/rule.item.fetch'),
        require('./rule/rule.condition.add'),
        require('./rule/rule.condition.edit'),
        require('./rule/rule.condition.fetch'),
        require('./rule/rule.condition.get'),
        require('./rule/rule.dropdown.list'),
        require('./rule/rule.rule.fetch'),
        require('./rule/rule.limitForUserByRole.get'),
        require('./rule/rule.rule.add'),
        require('./rule/rule.rule.edit'),
        require('./rule/rule.rule.fetch'),
        require('./rule/rule.rule.fetchDeleted'),
        require('./rule/rule.rule.remove')
    ];
};
