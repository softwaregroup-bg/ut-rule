module.exports = function utRule() {
    return {
        modules: {
            rule: {}
        },
        validations: {
            rule: require('./validations')
        }
    };
};
