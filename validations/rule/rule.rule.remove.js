// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.remove': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
