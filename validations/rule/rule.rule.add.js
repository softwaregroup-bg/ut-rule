// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.add': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
