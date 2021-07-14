// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.rule.fetchDeleted': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
