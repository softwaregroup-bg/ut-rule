var { mapconfig } = require('ut-audit/modules/history/helpers/mapconfig');
var { prepareRuleModel } = require('./helpers');

function prepareRulesHistory(data, config) {
    var rules = mapconfig(data, config);
    var formattedRules = prepareRuleModel(data);
    rules['Channel Info'] = formattedRules.channel;
    rules['Source'] = formattedRules.source;
    rules['Operation'] = formattedRules.operation;
    rules['Destination'] = formattedRules.destination;
    rules['Fee and Commission Split'] = formattedRules.split;
    rules['Limit'] = formattedRules.limit;

    return rules;
};

module.exports = {
    rule: prepareRulesHistory
};
