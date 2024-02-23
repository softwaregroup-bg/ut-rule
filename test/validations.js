/** @type { import("ut-run").validationFactory } */
module.exports = function validationTest({
    joi
}) {
    return {
        'integration.vChannel.fetch': () => ({
            params: joi.any(),
            result: joi.any()
        })
    };
};
