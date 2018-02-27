module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script')
    },
    validations: {
        rule: require('./validations')
    },
    errors: require('./errors')
});
