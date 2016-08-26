var joi = require('joi');
module.exports = {
    'decision.fetch': {
        description: 'Fetch applicable fee, limit and commission, based on passed properties of the transfer',
        notes: '',
        params: joi.object({
            channelCountryId: joi.number().integer(),
            channelRegionId: joi.number().integer(),
            channelCityId: joi.number().integer(),
            channelOrganizationId: joi.number().integer(),
            channelSupervisorId: joi.number().integer(),
            channelTags: joi.string().max(255),
            channelRoleId: joi.number().integer(),
            channelId: joi.number().integer(),
            operationId: joi.number().integer(),
            operationTags: joi.string().max(255),
            operationDate: joi.date().iso(),
            sourceCountryId: joi.number().integer(),
            sourceRegionId: joi.number().integer(),
            sourceCityId: joi.number().integer(),
            sourceOrganizationId: joi.number().integer(),
            sourceSupervisorId: joi.number().integer(),
            sourceTags: joi.string().max(255),
            sourceId: joi.number().integer(),
            sourceProductId: joi.number().integer(),
            sourceAccountId: joi.number().integer(),
            destinationCountryId: joi.number().integer(),
            destinationRegionId: joi.number().integer(),
            destinationCityId: joi.number().integer(),
            destinationOrganizationId: joi.number().integer(),
            destinationSupervisorId: joi.number().integer(),
            destinationTags: joi.string().max(255),
            destinationId: joi.number().integer(),
            destinationProductId: joi.number().integer(),
            destinationAccountId: joi.number().integer(),
            amount: joi.string().required().default('0'),
            currency: joi.string().length(3).required(0).default('TZS'),
            isSourceAmount: joi.boolean()
        }),
        result: joi.object({
            fee: joi.object({
                amount: joi.number()
            }).allow(null),
            commission: joi.object({
                amount: joi.number()
            }).optional(),
            limit: joi.object({
                minAmount: joi.number(),
                maxAmount: joi.number(),
                count: joi.number().integer()
            }).allow(null)
        })
    }
};
