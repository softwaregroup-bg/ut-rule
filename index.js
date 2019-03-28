module.exports = () => function utRule() {
    return {
        adapter: () => [
            require('./api/sql/schema'),
            require('./api/sql/seed'),
            require('./api/sql/standard'),
            require('./test/seed'),
            require('./errors')
        ],
        orchestrator: () => [
            require('ut-dispatch-db')(['rule'], ['utRule.rule']),
            require('./api/script'),
            require('./errors')
        ],
        gateway: () => [
            require('./validations')
        ]
    };
};
