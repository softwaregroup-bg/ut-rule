// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.addUnapproved': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
