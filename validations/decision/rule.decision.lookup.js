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
            sourceAccount: joi.string().required(),
            destinationAccount: joi.string().required(),
            amount: joi.number().required(),
            currency: joi.string().required(),
            isSourceAmount: joi.boolean().allow(0, 1, '0', '1')
        }),
        result: joi.object().keys({
            amount: joi.object().keys({
                acquirerFee: joi.number().required(),
                issuerFee: joi.number().required(),
                commission: joi.number().required(),
                transferDateTime: joi.string().required(),
                transferTypeId: joi.string().required()
            }),
            split: joi.array().items(
                joi.object().keys({
                    conditionId: joi.number().integer().required(),
                    splitNameId: joi.number().integer().required(),
                    tag: joi.string().required().allow(null),
                    amount: joi.number().required(),
                    debit: joi.string().required(),
                    credit: joi.string().required(),
                    description: joi.string().allow(null),
                    analytics: joi.string().allow(null)
                })
            )
        })
    })
});
