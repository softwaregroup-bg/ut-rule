// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.fetch': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
