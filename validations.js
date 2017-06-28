var joi = require('joi');
module.exports = {
    'decision.fetch': {
        description: 'Fetch applicable fee, limit and commission, based on passed properties of the transfer',
        notes: '',
        params: joi.object().keys({
            channelCountryId: joi.number().integer().allow(null).default(null),
            channelRegionId: joi.number().integer().allow(null).default(null),
            channelCityId: joi.number().integer().allow(null).default(null),
            channelOrganizationId: joi.number().integer().allow(null).default(null),
            channelSupervisorId: joi.number().integer().allow(null).default(null),
            channelTags: joi.string().max(255),
            channelRoleId: joi.number().integer().allow(null).default(null),
            channelId: joi.number().integer().allow(null).default(null),
            operationId: joi.number().integer().allow(null).default(null),
            operationTags: joi.string().max(255),
            operationDate: joi.date().iso(),
            sourceCountryId: joi.number().integer().allow(null).default(null),
            sourceRegionId: joi.number().integer().allow(null).default(null),
            sourceCityId: joi.number().integer().allow(null).default(null),
            sourceOrganizationId: joi.number().integer().allow(null).default(null),
            sourceSupervisorId: joi.number().integer().allow(null).default(null),
            sourceTags: joi.string().max(255),
            sourceId: joi.number().integer().allow(null).default(null),
            sourceProductId: joi.number().integer().allow(null).default(null),
            sourceAccountId: joi.number().integer().allow(null).default(null),
            destinationCountryId: joi.number().integer().allow(null).default(null),
            destinationRegionId: joi.number().integer().allow(null).default(null),
            destinationCityId: joi.number().integer().allow(null).default(null),
            destinationOrganizationId: joi.number().integer().allow(null).default(null),
            destinationSupervisorId: joi.number().integer().allow(null).default(null),
            destinationTags: joi.string().max(255),
            destinationId: joi.number().integer().allow(null).default(null),
            destinationProductId: joi.number().integer().allow(null).default(null),
            destinationAccountId: joi.number().integer().allow(null).default(null),
            amount: joi.number().required().default(0),
            currency: joi.string().length(3).required().default('TZS'),
            isSourceAmount: joi.boolean().allow(0, 1, '0', '1')
        }).unknown(),
        result: joi.object().keys({
            fee: joi.object().keys({
                amount: joi.number()
            }).allow(null).unknown(),
            commission: joi.object().keys({
                amount: joi.number()
            }).allow(null).unknown(),
            limit: joi.object().keys({
                minAmount: joi.number().allow(null),
                maxAmount: joi.number().allow(null),
                maxAmountDaily: joi.number().allow(null),
                maxCountDaily: joi.number().allow(null),
                maxAmountWeekly: joi.number().allow(null),
                maxCountWeekly: joi.number().allow(null),
                maxAmountMonthly: joi.number().allow(null),
                maxCountMonthly: joi.number().allow(null)
            }).allow(null).unknown()
        })
    },
    'item.fetch': {
        description: '',
        notes: '',
        params: joi.any(),
        result: joi.any()
    },
    'rule.fetch': {
        description: '',
        notes: '',
        params: joi.any(),
        result: joi.any()
    },
    'rule.add': {
        description: '',
        notes: '',
        params: joi.any(),
        result: joi.any()
    },
    'rule.remove': {
        description: '',
        notes: '',
        params: joi.any(),
        result: joi.any()
    },
    'rule.edit': {
        description: '',
        notes: '',
        params: joi.any(),
        result: joi.any()
    }
};
