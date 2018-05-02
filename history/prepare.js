var { prepareRule } = require('./helpers');

function prepareRuleHistory(data) {
    var rule = prepareRule(data);
    rule.channel && rule.channel.organization && (rule.channel.organization = ((data.conditionActor || []).find((actor) => actor.actorId === rule.channel.organization) || {}).organizationName);
    rule.source && rule.source.organization && (rule.source.organization = ((data.conditionActor || []).find((actor) => actor.actorId === rule.source.organization) || {}).organizationName);
    rule.destination && rule.destination.organization && (rule.destination.organization = ((data.conditionActor || []).find((actor) => actor.actorId === rule.destination.organization) || {}).organizationName);
    rule.split = (rule.split || {}).splits || [];
    return rule;
};

module.exports = {
    rule: prepareRuleHistory
};
