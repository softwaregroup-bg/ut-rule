// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi
}) => ({
    'rule.decision.lookup': () => ({
        description: 'Fetch applicable fee, limit and commission, based on passed properties of the transfer',
        params: joi.object().keys({
            channelId: joi.number().integer().allow(null).default(null),
            operation: joi.string().required(),
            operationDate: joi.date(),
            sourceAccount: joi.string().required(),
            destinationAccount: joi.string().required(),
            amount: joi.string().max(21).required(),
            settlementAmount: joi.string().max(21),
            accountAmount: joi.string().max(21),
            currency: joi.string().required(),
            settlementCurrency: joi.string(),
            accountCurrency: joi.string(),
            isSourceAmount: joi.boolean().allow(0, 1, '0', '1'),
            sourceCardProductId: joi.number().integer().allow(null)
        }),
        result: joi.object().keys({
            amount: joi.object().keys({
                settlementRateId: joi.number().integer().allow(null),
                settlementRateConditionName: joi.string().allow(null),
                settlementAmount: joi.number().allow(null),
                accountRateId: joi.number().integer().allow(null),
                accountRateConditionName: joi.string().allow(null),
                accountAmount: joi.number().allow(null),
                acquirerFee: joi.number().allow(null),
                issuerFee: joi.number().allow(null),
                processorFee: joi.number().allow(null),
                commission: joi.number().allow(null),
                transferDateTime: joi.date().required(),
                transferTypeId: joi.string().required()
            }),
            split: joi.array().items(
                joi.object().keys({
                    conditionId: joi.number().integer().required(),
                    conditionName: joi.string().required(),
                    splitNameId: joi.number().integer().required(),
                    tag: joi.string().required().allow(null),
                    amount: joi.number().required(),
                    debit: joi.string().required(),
                    credit: joi.string().required(),
                    description: joi.string().allow(null),
                    analytics: joi.object().allow(null)
                })
            )
        })
    })
});
