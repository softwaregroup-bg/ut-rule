// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.ruleOutOp.save': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
