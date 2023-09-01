// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.discard': () => ({
        params: joi.object({
            conditionId: joi.number().required()
        }),
        result: joi.any()
    })
});
