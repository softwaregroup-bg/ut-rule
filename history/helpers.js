const { prepareRuleModel } = require('../ui/common');
const prepareRule = (result) => {
    const rule = prepareRuleModel(result);
    return rule;
};

module.exports = {
    prepareRule
};
