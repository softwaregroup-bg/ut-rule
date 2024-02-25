// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        bigintRequired,
        condition
    }
}) => ({
    'rule.condition.get': () => ({
        params: joi.object({
            conditionId: bigintRequired
        }),
        result: condition

    })
});
