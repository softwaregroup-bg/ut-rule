// @ts-check
/** @type { import("ut-run").validationLib } */
module.exports = ({
    joi,
    lib: {
        integerNull,
        integerRequired,
        boolNull,
        bigintNull,
        bigintRequired,
        bigintNotNull,
        dateNull,
        stringNull,
        stringNullEmpty,
        stringRequired,
        numberNull,
        numberRequired,
        bigintArray = joi.array().items(bigintNotNull).allow(null)
    }
}) => ({
    condition: joi.object({
        condition: joi.object({
            conditionId: bigintNull,
            name: stringRequired.max(100),
            description: stringNull.max(100),
            notes: stringNull.max(1000),
            priority: integerNull,
            operationEndDate: dateNull,
            operationStartDate: dateNull,
            sourceAccountId: stringNull.max(255),
            destinationAccountId: stringNull.max(255),
            decision: joi.object().allow(null),
            status: stringNull.max(100),
            isEnabled: boolNull

        }),
        channel: joi.object({
            country: bigintArray,
            region: bigintArray,
            city: bigintArray,
            actor: bigintArray,
            actorTag: stringNullEmpty
        }).unknown(true),
        operation: joi.object({
            type: joi.array().allow(null),
            tag: stringNullEmpty,
            transferTag: stringNullEmpty
        }).unknown(true),
        source: joi.object({
            actor: bigintArray,
            actorTag: stringNullEmpty,
            customerType: bigintArray,
            kyc: bigintArray,
            accountProduct: bigintArray,
            accountFeePolicy: bigintArray,
            cardProduct: bigintArray,
            country: bigintArray,
            region: bigintArray,
            city: bigintArray
        }),
        destination: joi.object({
            actor: bigintArray,
            actorTag: stringNullEmpty,
            customerType: bigintArray,
            kyc: bigintArray,
            accountProduct: bigintArray,
            accountFeePolicy: bigintArray,
            cardProduct: bigintArray,
            country: bigintArray,
            region: bigintArray,
            city: bigintArray
        }),
        splitName: joi.array().items(joi.object({
            conditionId: bigintRequired,
            splitNameId: integerRequired,
            name: stringRequired.max(50),
            amountType: joi.allow(null, 1, 2),
            tag: joi.array().items(joi.string())
        })),
        splitAssignment: joi.array().items(joi.object({
            splitNameId: integerRequired,
            splitAssignmentId: integerRequired,
            description: stringRequired.max(50),
            debit: stringRequired.max(50),
            credit: stringRequired.max(50),
            quantity: stringNull.max(50),
            minValue: numberNull,
            maxValue: numberNull,
            percent: numberNull
        })),
        splitRange: joi.array().items(joi.object({
            splitRangeId: integerRequired,
            splitNameId: integerRequired,
            startAmountCurrency: stringRequired.length(3),
            startAmount: numberRequired,
            startAmountDaily: numberRequired,
            startAmountMonthly: numberRequired,
            startAmountWeekly: numberRequired,
            startCountDaily: bigintRequired,
            startCountMonthly: bigintRequired,
            startCountWeekly: bigintRequired,
            minValue: numberNull,
            maxValue: numberNull,
            percent: numberNull,
            percentBase: numberNull,
            isSourceAmount: boolNull
        })),
        splitAnalytic: joi.array().items(joi.object({
            splitAnalyticId: integerRequired,
            splitAssignmentId: integerRequired,
            name: stringNull.max(50),
            value: stringNull.max(100)
        })),
        limit: joi.array().items(joi.object({
            limitId: bigintNull,
            conditionId: bigintNull,
            currency: stringRequired.length(3),
            amountType: joi.allow(null, 1, 2),
            minAmount: numberNull,
            maxAmount: numberNull,
            maxAmountDaily: numberNull,
            maxAmountWeekly: numberNull,
            maxAmountMonthly: numberNull,
            maxCountWeekly: bigintNull,
            maxCountDaily: bigintNull,
            maxCountMonthly: bigintNull,
            credentials: integerNull,
            priority: integerNull.min(-32768).max(32767)
        }).unknown(true)),
        rate: joi.array().items(joi.object({
            rateId: bigintNull,
            conditionId: bigintNull,
            startAmountCurrency: stringRequired.length(3),
            targetCurrency: stringRequired.length(3),
            startAmount: numberNull,
            startAmountDaily: numberNull,
            startAmountMonthly: numberNull,
            startAmountWeekly: numberNull,
            startCountDaily: bigintNull,
            startCountMonthly: bigintNull,
            startCountWeekly: bigintNull,
            rate: numberRequired
        }))
    }).unknown(true) // allow implementations to add extra properties
});
