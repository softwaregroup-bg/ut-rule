let { prepareRuleModel } = require('../common');
const prepareRule = (result) => {
    var rule = prepareRuleModel(result);
    return rule;
};

module.exports = {
    prepareRule
};
