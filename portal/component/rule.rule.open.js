// @ts-check
/** @type { import("../../handlers").handlerFactory } */
export default ({
    lib: {
        page
    }
}) => ({
    'rule.rule.open': () => ({
        title: 'Edit Rule',
        permission: 'rule.rule.edit',
        async component() {
            const {default: RuleEdit} = await import('../../ui/react/pages/RuleProfile/Edit');
            return params => page(RuleEdit, params);
        }
    })
});
