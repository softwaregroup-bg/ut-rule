module.exports = () => function utRule() {
    return [
        function adapter() {
            return {
                modules: {
                    'db/rule': require('./api/sql/schema'),
                    ruleSeed: require('./api/sql/seed'),
                    ruleStandard: () => require('./api/sql/standard'),
                    ruleTest: () => require('./test/schema')
                },
                errors: [
                    require('./errors')
                ]
            };
        },
        function orchestrator() {
            return {
                ports: [
                    require('ut-dispatch-db')(['rule'])
                ],
                modules: {
                    rule: require('./api/script')
                },
                errors: [
                    require('./errors')
                ]
            };
        },
        function gateway() {
            return {
                validations: {
                    rule: require('./validations')
                }
            };
        }
    ];
};
