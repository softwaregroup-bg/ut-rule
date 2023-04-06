// @ts-check
/** @type { import("ut-run").validationFactory } */
module.exports = ({
    joi,
    lib: {
        stringRequired,
        numberRequired
    }
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
            sourceCardProductId: joi.number().integer().allow(null),
            transferProperties: joi.object()
        }),
        result: joi.object().keys({
            amount: joi.object().keys({
                settlementRateId: joi.number().integer().allow(null),
                settlementRateConditionName: joi.string().allow(null),
                settlementAmount: joi.string().max(21).allow(null),
                settlementCurrency: joi.string(),
                accountRateId: joi.number().integer().allow(null),
                accountRateConditionName: joi.string().allow(null),
                accountAmount: joi.string().max(21).allow(null),
                accountCurrency: joi.string(),
                acquirerFee: joi.string().max(21).allow(null),
                issuerFee: joi.string().max(21).allow(null),
                processorFee: joi.string().max(21).allow(null),
                transferFee: joi.string().max(21).allow(null),
                commission: joi.string().max(21).allow(null),
                transferDateTime: joi.date().required(),
                transferTypeId: joi.string().required()
            }),
            split: joi.array().items(
                joi.object().keys({
                    conditionId: joi.number().integer().required(),
                    conditionName: joi.string().required(),
                    splitNameId: joi.number().integer().required(),
                    tag: joi.string().required().allow(null),
                    currency: joi.string().required(),
                    amount: joi.string().max(21).required(),
                    quantity: joi.string().max(21).allow(null),
                    debit: joi.string().required(),
                    credit: joi.string().required(),
                    description: joi.string().allow(null),
                    analytics: joi.object().allow(null)
                })
            )
        })
    })
});
