/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        rule: function(test, bus, run, ports, {
            ruleRuleAdd
        }) {
            return run(test, bus, [
                'Generate admin user',
                'Login admin user',
                ruleRuleAdd({
                    name: 'rule1',
                    params: {
                        name: 'Rule ' + Date.now()
                    }
                })
            ]);
        }
    };
};
