// @ts-check
/** @type { import("../../handlers").handlerFactory } */
export default ({
    lib: {
        page
    }
}) => ({
    'rule.rule.new': () => ({
        title: 'Create Rule',
        permission: 'rule.rule.add',
        async component() {
            const {default: RuleCreate} = await import('../../ui/react/pages/RuleProfile/Create');
            return params => page(RuleCreate, params);
        }
    })
});
