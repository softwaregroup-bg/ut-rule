module.exports = () => function utRule() {
    return {
        browser: () => [
            function ui() {
                return require('./ui/react').ui(...arguments);
            }
        ]
    };
};
