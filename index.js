module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script'),
        'db/rule': require('./api/sql')
    },
    validations: {
        rule: require('./validations')
    },
    errors: require('./errors')(require('ut-error').define)
});
