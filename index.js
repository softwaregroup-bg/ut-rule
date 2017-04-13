module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script'),
        'db/rule': require('./api/sql')
    },
    validations: {
        'db/rule': require('./validations')
    }
});
