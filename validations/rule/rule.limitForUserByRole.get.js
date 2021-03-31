// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.limitForUserByRole.get': () => ({
        description: 'Get limit for user by role',
        params: joi.object({
            userId: joi.number().integer().required(),
            operation: joi.string().optional(),
            currency: joi.string().optional(),
            property: joi.string().optional(),
            nextLevel: joi.boolean().optional(),
            approvedAmount: joi.number().optional()
        }),
        result: joi.any()
    })
});
