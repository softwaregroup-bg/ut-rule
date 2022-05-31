// @ts-check
/** @type { import("ut-run").validationSet } */
module.exports = function validation() {
    return [
        require('./decision/rule.decision.fetch'),
        require('./decision/rule.decision.lookup'),
        require('./item/rule.item.fetch'),
        require('./rule/rule.rule.fetch'),
        require('./rule/rule.limitForUserByRole.get'),
        require('./rule/rule.rule.add'),
        require('./rule/rule.rule.edit'),
        require('./rule/rule.rule.fetch'),
        require('./rule/rule.rule.fetchDeleted'),
        require('./rule/rule.rule.remove'),
        require('./rule/rule.rule.addUnapproved'),
        require('./rule/rule.rule.get'),
        require('./rule/rule.rule.approve'),
        require('./rule/rule.rule.reject'),
        require('./rule/rule.rule.discard')
    ];
};
