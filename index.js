module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script'),
        errors: require('./errors'),
        'db/rule': require('./api/sql')
    },
    validations: {
        rule: require('./validations/rule'),
        'db/rule': require('./validations/db/rule')
    }
});
