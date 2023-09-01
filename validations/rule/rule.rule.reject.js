// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.reject': () => ({
        params: joi.object({
            conditionId: joi.string().required(),
            rejectReason: joi.string().required()
        }),
        result: joi.any()
    })
});
