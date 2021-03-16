// @ts-check
/** @type { import("../../handlers").handlerFactory } */
export default ({
    lib: {
        page
    }
}) => ({
    'rule.rule.browse': () => ({
        title: 'Fees, Commissions and Limits',
        permission: 'rule.rule.fetch',
        async component() {
            const {default: Rules} = await import('../../ui/react/pages/Rules');
            return () => page(Rules);
        }
    })
});
