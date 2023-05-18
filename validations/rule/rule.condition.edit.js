// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.condition.edit': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
