// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.lock': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
