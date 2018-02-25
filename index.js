module.exports = () => ({
    ports: [],
    modules: {
        rule: require('./api/script')
    },
    validations: {
        rule: require('./validations/rule')
    },
    errors: require('./errors')
});
