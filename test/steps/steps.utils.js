module.exports = function steps({version, callSite}) {
    if (!version || !version('10.58.0')) throw new Error('ut-rule requires ut-run >= 10.58.0');
    return {
        'steps.rule.utils': {
            sourceAccountNumber: '$' + '{source.account.number}',
            sourceAccountIdLinked: '$' + '{source.account.id}.linked',
            destinationAccountNumber: '$' + '{destination.account.number}',
            // condition items
            operationCategory: 'oc',
            sourceCategory: 'sc',
            destinationCategory: 'dc',
            // condition actors
            channelOrganization: 'co',
            // split analytics
            feeType: 'feeType',
            vat: 'VAT',
            otherTax: 'otherTax',
            merchantTax: 'merchantTax',
            credit: 'credit',
            channelId: '$' + '{channel.id}',
            agentId: 'agentId',
            statusId: 'statusId',
            // tags
            acquirerTag: '|acquirer|',
            issuerTag: '|issuer|',
            merchantTag: '|merchant|',
            feeTag: '|fee|',
            acquirerFeeTag: '|acquirer|fee|',
            issuerFeeTag: '|issuer|fee|',
            agentCommissionPendingTag: '|agent|commission|pending|',
            ruleExceedMinLimitAmount: 'rule.exceedMinLimitAmount',
            ruleExceedMaxLimitAmount: 'rule.exceedMaxLimitAmount',
            ruleExceedDailyLimitAmount: 'rule.exceedDailyLimitAmount',
            ruleExceedDailyLimitCount: 'rule.exceedDailyLimitCount',
            transactionFeePercent: 100,
            transactionFee: 10.50,
            feeToVatPercent: 10,
            feeToOtherTaxPercent: 15,
            successfulTransactionsCount: 0,
            walletToWallet: 'walletToWallet',
            usdCurrency: 'USD',
            conditionTypePerson: 'person'
        }
    };
};
