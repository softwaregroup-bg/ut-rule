// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.condition.fetch': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
