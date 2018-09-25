var joi = require('joi');

module.exports = {
    description: 'Get limit for user by role',
    notes: '',
    params: joi.object({
        userId: joi.number().integer().required(),
        operation: joi.string().optional(),
        currency: joi.string().optional(),
        property: joi.string().optional(),
        nextLevel: joi.boolean().optional(),
        approvedAmount: joi.number().optional()
    }),
    result: joi.any()
};
