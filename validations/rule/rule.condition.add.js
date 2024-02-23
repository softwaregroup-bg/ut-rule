// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        condition
    }
}) => ({
    'rule.condition.add': () => ({
        params: condition,
        result: condition
    })
});
