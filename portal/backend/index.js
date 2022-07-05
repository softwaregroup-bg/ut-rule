/** @type { import("../../handlers").handlerSet } */
export default function backend() {
    return [
        () => ({namespace: ['rule']}),
        require('./rule.rule').default
    ];
};
