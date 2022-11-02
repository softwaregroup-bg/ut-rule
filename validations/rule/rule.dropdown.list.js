// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        dropdownItems
    }
}) => ({
    'rule.dropdown.list': () => ({
        description: 'list dropdown items',
        notes: ['list dropdown items'],
        tags: ['ledger', 'dropdown', 'list'],
        params: joi.object(),
        result: joi.object({
            'rule.currency': dropdownItems,
            'rule.country': dropdownItems,
            'rule.region': dropdownItems,
            'rule.city': dropdownItems,
            'rule.accountProduct': dropdownItems,
            'rule.cardProduct': dropdownItems,
            'rule.channel': dropdownItems,
            'rule.role': dropdownItems,
            'rule.operation': dropdownItems
        })
    })
});
