// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.get': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
