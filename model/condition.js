/** @type { import('ut-model').model<'rule', 'condition'> } */
module.exports = ({joi}) => ({
    subject: 'rule',
    object: 'condition',
    browser: {
        fetch: ({condition, paging}) => ({...condition, ...paging})
    },
    methods: {
        fetch: 'rule.rule.fetch',
        get: 'rule.rule.fetch'
    },
    nameField: 'condition.priority',
    schema: {
        properties: {
            condition: {
                properties: {
                    conditionId: {},
                    priority: {title: 'Priority'},
                    operationEndDate: {title: 'End Date'},
                    operationStartDate: {title: 'Start Date'},
                    sourceAccountId: {title: 'Source Account'},
                    destinationAccountId: {title: 'Destination Account'},
                    createdOn: {title: 'Creation Date'},
                    updatedOn: {title: 'Last Modification Date'}
                }
            },
            conditionActor: {
                widget: {
                    type: 'table',
                    widgets: ['factor', 'type', 'actor']
                },
                items: {
                    properties: {
                        factor: {},
                        type: {},
                        actor: {}
                    }
                }
            },
            conditionItem: {
                widget: {
                    type: 'table',
                    widgets: ['factor', 'type', 'itemNameId']
                },
                items: {
                    properties: {
                        factor: {},
                        type: {},
                        itemNameId: {}
                    }
                }
            },
            splitName: {
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    widgets: ['name', 'tag']
                },
                items: {
                    properties: {
                        name: {},
                        tag: {}
                    }
                }
            },
            splitRange: {
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    widgets: [
                        'startAmountCurrency',
                        'startAmount',
                        'startAmountDaily',
                        'startAmountMonthly',
                        'startAmountWeekly',
                        'startCountDaily',
                        'startCountMonthly',
                        'startCountWeekly',
                        'minValue',
                        'maxValue',
                        'percent',
                        'percentBase'
                    ]
                },
                items: {
                    properties: {
                        startAmountCurrency: {},
                        startAmount: {type: 'number'},
                        startAmountDaily: {type: 'number'},
                        startAmountMonthly: {type: 'number'},
                        startAmountWeekly: {type: 'number'},
                        startCountDaily: {type: 'integer'},
                        startCountMonthly: {type: 'integer'},
                        startCountWeekly: {type: 'integer'},
                        minValue: {type: 'number'},
                        maxValue: {type: 'number'},
                        percent: {type: 'number'},
                        percentBase: {type: 'number'}
                    }
                }
            },
            splitAssignment: {
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    widgets: ['description', 'debit', 'credit', 'percent', 'minAmount', 'maxAmount']
                },
                items: {
                    properties: {
                        description: {},
                        debit: {},
                        credit: {},
                        minValue: {},
                        maxValue: {},
                        percent: {}
                    }
                }
            }
        }
    },
    cards: {
        browse: {
            label: 'Fees, Commissions and Limits (FCL)',
            widgets: [
                'condition.priority',
                'condition.operationEndDate',
                'condition.operationStartDate',
                'condition.sourceAccountId',
                'condition.destinationAccountId'
            ]
        },
        condition: {
            label: 'Conditions',
            widgets: [
                'condition.priority',
                'condition.operationEndDate',
                'condition.operationStartDate',
                'condition.sourceAccountId',
                'condition.destinationAccountId',
                'conditionActor',
                'conditionItem'
            ]
        },
        split: {
            label: 'Assignment',
            widgets: [
                'splitName',
                'splitRange',
                'splitAssignment'
            ]
        }
    },
    layouts: {
        edit: [
            'hidden',
            'condition',
            'split'
        ]
    }
});
