var test = require('ut-run/test');
var commonFunc = require('ut-test/lib/methods/commonFunc');
var ruleConstants = require('ut-test/lib/constants/rule').constants();
// var ruleMethods = require('ut-test/lib/methods/rule');
var coreJoiValidation = require('ut-test/lib/joiValidations/core');
var ruleJoiValidation = require('ut-test/lib/joiValidations/rule');
var userConstants = require('ut-test/lib/constants/user').constants();
var userMethods = require('ut-test/lib/methods/user');
const PRIORITY = ruleConstants.PRIORITY;
const OPERATIONENDDATE = ruleConstants.OPERATIONENDDATE;
// var stdPolicy;
const CITY = 'city';
const REGION = 'region';
const COUNTRY = 'country';
const CHANNEL = 'channel';
const CURRENCY = 'currency';
const OPERATION = 'operation';
var channelId1, currencyName1, operationIdWithdraw, operationIdSale, operationIdDeposit, operationIdTopUp,
    operationIdFundsTransfer;

module.exports = function(opt, cache) {
    test({
        type: 'integration',
        name: 'add rules',
        server: opt.server,
        serverConfig: opt.serverConfig,
        client: opt.client,
        clientConfig: opt.clientConfig,
        steps: function(test, bus, run) {
            return run(test, bus, [userMethods.login('login admin', userConstants.ADMINUSERNAME, userConstants.ADMINPASSWORD, userConstants.TIMEZONE),
                userMethods.getUser('get admin details', context => context['login admin']['identity.check'].actorId),
                // fetch std input policy
                // commonFunc.createStep('policy.policy.fetch', 'get std input by admin policy', (context) => {
                //     return {
                //         searchString: 'STD'
                //     };
                // }, (result, assert) => {
                //     var policy = result.policy.find(
                //         (singlePolicy) => singlePolicy.name.indexOf('STD_input') > -1
                //     );
                //     stdPolicy = (policy.policyId).toString();
                // }),
                // Fetch item type translations
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch counties', (context) => {
                    return {
                        itemTypeName: COUNTRY
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    // countryId1 = result.itemTranslationFetch[0].itemNameId;
                }),
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch regions', (context) => {
                    return {
                        itemTypeName: REGION
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    // regionId1 = result.itemTranslationFetch[0].itemNameId;
                }),
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch cities', (context) => {
                    return {
                        itemTypeName: CITY
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    // cityId1 = result.itemTranslationFetch[0].itemNameId;
                }),
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch channels', (context) => {
                    return {
                        itemTypeName: CHANNEL
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    // channelId1 = result.itemTranslationFetch.find(item => item.itemName === 'atm').itemNameId;
                    // channelIdIso = result.itemTranslationFetch.find(item => item.itemName === 'iso').itemNameId;
                }),
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch currencies', (context) => {
                    return {
                        itemTypeName: CURRENCY
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    currencyName1 = result.itemTranslationFetch.find(item => item.itemName === 'USD').itemName;
                }),
                commonFunc.createStep('core.itemTranslation.fetch', 'fetch operations', (context) => {
                    return {
                        itemTypeName: OPERATION
                    };
                }, (result, assert) => {
                    assert.equals(coreJoiValidation.validateFetchItemTranslation(result.itemTranslationFetch[0]).error, null, 'Return all details after listing itemName');
                    operationIdWithdraw = result.itemTranslationFetch.find(item => item.itemName === 'Withdraw / cash out').itemNameId;
                    operationIdSale = result.itemTranslationFetch.find(item => item.itemName === 'Sale').itemNameId;
                    operationIdDeposit = result.itemTranslationFetch.find(item => item.itemName === 'Deposit / cash in').itemNameId;
                    operationIdTopUp = result.itemTranslationFetch.find(item => item.itemName === 'Top up').itemNameId;
                    operationIdFundsTransfer = result.itemTranslationFetch.find(item => item.itemName === 'Funds transfer to account').itemNameId;
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for atm withdraw', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY, // mandatory
                            channelTag: '|atm|',
                            operationId: operationIdWithdraw
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Withdraw fee - own ATM', // mandatory
                                        tag: '|acquirer|atm|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        // minValue: 35, only for nbv
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0 // in nbv it is 4
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 100, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 1000,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 2000,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 3,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 5,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 3000,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 4000,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 7,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 9,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 5000,
                                        startCountMonthly: 0
                                    }, {
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 10
                                    }],
                                    splitAssignment: [{
                                        credit: 'channel.$' + '{channel.id}.fee',
                                        debit: '$' + '{source.account.number}',
                                        description: 'ATM fee - acquirer', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw amount - own ATM', // mandatory
                                        tag: '|acquirer|atm|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        minValue: 0,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 4,
                                        startCountMonthly: 0,
                                        percent: 100
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: 'channel.$' + '{channel.id}.amount',
                                        debit: '$' + '{source.account.number}',
                                        description: 'ATM fee - acquirer', // mandatory
                                        percent: 100
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.decision.lookup', 'fetch decision rule', (context) => {
                    return {
                        channelId: channelId1,
                        operation: 'Withdraw / cash out',
                        operationDate: OPERATIONENDDATE,
                        sourceAccount: '263042584650066',
                        destinationAccount: '2630425846500661',
                        amount: 10,
                        currency: currencyName1,
                        isSourceAmount: false
                    };
                }, (result, assert) => {
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for iso withdraw', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 1, // mandatory
                            channelTag: '|iso|',
                            operationId: operationIdWithdraw
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Withdraw amount - foreign ATM', // mandatory
                                        tag: '|issuer|atm|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        minValue: 0,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: 'channel.$' + '{channel.id}.amount',
                                        debit: '$' + '{source.account.number}',
                                        description: 'ATM amount - issuer', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw issuer fee - foreign ATM', // mandatory
                                        tag: '|issuer|atm|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        minValue: 35,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // percentBase: 100
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: 'channel.$' + '{channel.id}.fee',
                                        debit: '$' + '{source.account.number}',
                                        description: 'ATM fee - issuer', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw acquirer fee - foreign ATM', // mandatory
                                        tag: '|acquirer|atm|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        minValue: 100,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{channel.id}.amount',
                                        debit: '$' + '{source.account.number}',
                                        description: 'ATM fee - acquirer', // mandatory
                                        percent: 100
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for ped withdraw', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 2, // mandatory
                            channelTag: '|ped|',
                            operationId: operationIdWithdraw
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Withdraw amount - PED', // mandatory
                                        tag: '|acquirer|ped|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{channel.id}.amount',
                                        debit: '$' + '{source.account.number}',
                                        description: 'PED amount - withdraw', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw fee - PED', // mandatory
                                        tag: '|acquirer|ped|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        maxValue: 0,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for agent withdraw', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 3, // mandatory
                            channelTag: '|agent|',
                            operationId: operationIdWithdraw
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'commission', // mandatory
                                        tag: '|agent|commission|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        minValue: 5,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 3
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 1,
                                        startAmount: 10, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 2,
                                        startAmount: 20, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 10,
                                        startAmount: 500, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 2
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 5,
                                        startAmount: 1000, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 15,
                                        startAmount: 1500, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 1
                                        // flatValue: 10!!!
                                    }, {
                                        isSourceAmount: false,
                                        minValue: 20,
                                        startAmount: 2000, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                        // flatValue: 10!!!
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{channel.id}.fee',
                                        debit: '$' + '{source.account.number}',
                                        description: 'commission 20%', // mandatory
                                        percent: 20
                                    }, {
                                        credit: '$' + '{channel.id}.fee',
                                        debit: '$' + '{source.account.number}',
                                        description: 'commission 80%', // mandatory
                                        percent: 80
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for iso sale', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 4, // mandatory
                            channelTag: '|iso|',
                            operationId: operationIdSale
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Withdraw amount - foreign POS', // mandatory
                                        tag: '|issuer|pos|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{channel.id}.amount',
                                        debit: '$' + '{source.account.number}',
                                        description: 'POS amount - issuer', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw issuer fee - foreign POS', // mandatory
                                        tag: '|issuer|pos|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        maxValue: 0,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Withdraw acquirer fee - foreign POS', // mandatory
                                        tag: '|acquirer|pos|fee|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        maxValue: 0,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for ped deposit', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 5, // mandatory
                            channelTag: '|ped|',
                            operationId: operationIdDeposit
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Deposit amount - PED', // mandatory
                                        tag: '|acquirer|ped|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{source.account.number}',
                                        debit: '$' + '{channel.id}.amount',
                                        description: 'PED amount - deposit', // mandatory
                                        percent: 100
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for atm top up', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 6, // mandatory
                            channelTag: '|atm|',
                            operationId: operationIdTopUp
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Topup amount - own ATM', // mandatory
                                        tag: '|issuer|atm|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{destination.account.number}',
                                        debit: '$' + '{source.account.number}',
                                        description: 'Topup amount', // mandatory
                                        percent: 100
                                    }]
                                }, {
                                    splitName: {
                                        name: 'Topup commission - own ATM', // mandatory
                                        tag: '|issuer|atm|commission|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 7
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{channel.id}.commission',
                                        debit: '$' + '{destination.account.number}',
                                        description: 'Topup commission', // mandatory
                                        percent: 100
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for finds transfer', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 7, // mandatory
                            operationId: operationIdFundsTransfer
                        },
                        split: {
                            data: {
                                rows: [{
                                    splitName: {
                                        name: 'Transfer amount', // mandatory
                                        tag: '|issuer|'
                                    },
                                    splitRange: [{
                                        isSourceAmount: false,
                                        startAmount: 0, // mandatory
                                        startAmountCurrency: currencyName1, // mandatory,
                                        startAmountDaily: 0,
                                        startCountDaily: 0,
                                        startAmountWeekly: 0,
                                        startCountWeekly: 0,
                                        startAmountMonthly: 0,
                                        startCountMonthly: 0,
                                        percent: 100
                                    }],
                                    splitAssignment: [{
                                        credit: '$' + '{destination.account.number}',
                                        debit: '$' + '{source.account.number}',
                                        description: 'Transfer amount', // mandatory
                                        percent: 100
                                    }]
                                }]
                            }
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for atm limit', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 8,
                            operationTag: '|atm|'
                        },
                        limit: {
                            currency: currencyName1
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                }),
                commonFunc.createStep('rule.rule.add', 'add rule for pos limit', (context) => {
                    return {
                        condition: {
                            priority: PRIORITY + 9,
                            operationTag: '|pos|'
                        },
                        limit: {
                            currency: currencyName1
                        }
                    };
                }, (result, assert) => {
                    assert.equals(ruleJoiValidation.validateAddRule(result).error, null, 'Return all detals after add rule');
                })
            ]);
        }
    }, cache);
};
