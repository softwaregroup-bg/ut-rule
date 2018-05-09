module.exports = function utRule() {
    return {
        ports: [],
        modules: {
            'db/rule': require('./api/sql')
        }
    };
};
