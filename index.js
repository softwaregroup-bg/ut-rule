module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script'),
        'db/rule': require('./api/sql')
    },
    validations: {
        rule: require('./validations/rule'),
        'db/rule': require('./validations/db/rule')
    }
});