var joi = require('joi');

module.exports = {
    description: '',
    notes: '',
    params: joi.object().keys({
        condition: joi.array().items(
            joi.object().keys({
                conditionId: joi.number().integer().required(),
                priority: joi.number().min(0).integer().required(),
                operationStartDate: joi.date().allow(null),
                operationEndDate: joi.date().allow(null),
                sourceAccountId: joi.string().allow(null),
                destinationAccountId: joi.string().allow(null)
            }),
        ),
        conditionActor: joi.array(),
        conditionItem: joi.array(),
        conditionProperty: joi.array(),
        limit: joi.array().items(
            joi.object().keys({
                limitId: joi.number().integer().min(0).optional(),
                conditionId: joi.number().integer().min(0).required(),
                currency: joi.string().alphanum().max(4).required().allow('EGP'),
                minAmount: joi.number().integer().min(0).allow(null),
                maxAmount: joi.number().integer().min(0).allow(null),
                maxAmountDaily: joi.number().integer().min(0).allow(null),
                maxCountDaily: joi.number().integer().min(0).allow(null),
                maxAmountWeekly: joi.number().integer().min(0).allow(null),
                maxCountWeekly: joi.number().integer().min(0).allow(null),
                maxAmountMonthly: joi.number().integer().min(0).allow(null),
                maxCountMonthly: joi.number().integer().min(0).allow(null)
            })
        ),
        split: joi.object({
            data: joi.object({
                rows: joi.array().items(
                    joi.object().keys({
                        splitName: joi.object().required(),
                        splitAssignment: joi.array(),
                        splitRange: joi.array().items(
                            joi.object().keys({
                                startAmount: joi.number().integer().min(0).allow(null),
                                isSourceAmount: joi.boolean(),
                                minValue: joi.number().integer().min(0).allow(null),
                                maxValue: joi.number().integer().min(0).allow(null).optional(),
                                percent: joi.number().integer().min(0).allow(null).optional(),
                                startAmountDaily: joi.number().integer().min(0).allow(null),
                                startCountDaily: joi.number().integer().min(0).allow(null),
                                startAmountMonthly: joi.number().integer().min(0).allow(null),
                                startCountMonthly: joi.number().integer().min(0).allow(null),
                                startAmountWeekly: joi.number().integer().min(0).allow(null),
                                startCountWeekly: joi.number().integer().min(0).allow(null),
                                startAmountCurrency: joi.string().alphanum().max(4).allow('EGP')
                            })
                        ).allow(null),
                        splitCumulative: joi.array().items(
                            joi.object().keys({
                                dailyAmount: joi.number().integer().min(0).allow(null),
                                dailyCount: joi.number().integer().min(0).allow(null),
                                mounthlyAmount: joi.number().integer().min(0).allow(null),
                                mounthlyCount: joi.number().integer().min(0).allow(null),
                                weeklyAmount: joi.number().integer().min(0).allow(null),
                                weeklyCount: joi.number().integer().min(0).allow(null),
                                currency: joi.string().alphanum().max(4).allow('EGP'),
                                splitRange: joi.array().items(
                                    joi.object().keys({
                                        startAmount: joi.number().integer().min(0).allow(null),
                                        isSourceAmount: joi.boolean(),
                                        minValue: joi.number().integer().min(0).allow(null),
                                        maxValue: joi.number().integer().min(0).allow(null).optional(),
                                        percent: joi.number().integer().min(0).allow(null).optional(),
                                        startAmountDaily: joi.number().integer().min(0).allow(null),
                                        startCountDaily: joi.number().integer().min(0).allow(null),
                                        startAmountMonthly: joi.number().integer().min(0).allow(null),
                                        startCountMonthly: joi.number().integer().min(0).allow(null),
                                        startAmountWeekly: joi.number().integer().min(0).allow(null),
                                        startCountWeekly: joi.number().integer().min(0).allow(null),
                                        startAmountCurrency: joi.string().alphanum().max(4).allow('EGP')
                                    })
                                ).allow(null)
                            })
                        ).allow(null)
                    }).optional()
                ).allow([])
            })
        })
    }),
    result: joi.any()
};
