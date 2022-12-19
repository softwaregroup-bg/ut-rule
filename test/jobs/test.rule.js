/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        rule: function(test, bus, run, ports, {
            ruleRuleAdd,
            ruleConditionGet,
            ruleConditionFetch
        }) {
            return run(test, bus, [
                'Generate admin user',
                'Login admin user',
                ruleConditionFetch({
                    params: {
                        name: 'Test Split Range'
                    }
                }),
                ruleRuleAdd({
                    name: 'rule1',
                    params: {
                        name: 'Rule ' + Date.now()
                    }
                }),
                ruleConditionGet({
                    name: 'getRule1',
                    params: ({rule1: {condition: [{conditionId}]}}) => ({conditionId})
                })
            ]);
        }
    };
};
