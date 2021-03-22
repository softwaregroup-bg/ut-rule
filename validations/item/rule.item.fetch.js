// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.item.fetch': () => ({
        params: joi.any(),
        result: joi.any()
    })
});
