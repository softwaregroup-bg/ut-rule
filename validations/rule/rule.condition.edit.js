// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        condition
    }
}) => ({
    'rule.condition.edit': () => ({
        params: condition,
        result: condition
    })
});
