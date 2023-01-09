// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.condition.get': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
