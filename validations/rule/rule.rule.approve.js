// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.approve': () => ({
        params: joi.object({
            conditionId: joi.string().required()
        }),
        result: joi.any()
    })
});
