// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.edit': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
