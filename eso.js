module.exports = function utRule() {
    return {
        modules: {
            rule: require('./api/script')
        },
        errors: [
            require('./errors')
        ]
    };
};
