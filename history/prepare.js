var { prepareRuleModel } = require('./helpers');

function prepareRulesHistory(data) {
    var rules = prepareRuleModel(data);
    return rules;
};

module.exports = {
    rule: prepareRulesHistory
};
