// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.condition.add': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
