/** @type { import("../../handlers").handlerSet } */
module.exports = function backend() {
    return [
        () => ({namespace: ['rule']}),
        require('./rule.rule').default
    ];
};
