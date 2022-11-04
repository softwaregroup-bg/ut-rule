/** @type { import('ut-model').model<'rule', 'condition'> } */
module.exports = ({joi}) => ({
    subject: 'rule',
    object: 'condition',
    browser: {
        fetch: ({condition, paging}) => ({...condition, ...paging})
    },
    nameField: 'condition.priority',
    schema: {
        properties: {
            condition: {
                properties: {
                    conditionId: {},
                    priority: {title: 'Priority'},
                    operationEndDate: {title: 'End Date', widget: {type: 'date-time'}},
                    operationStartDate: {title: 'Start Date', widget: {type: 'date-time'}},
                    sourceAccountId: {title: 'Account'},
                    destinationAccountId: {title: 'Account'}
                },
                required: ['priority']
            },
            conditionActor: {
                title: '',
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
                title: '',
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
                title: '',
                widget: {
                    type: 'table',
                    master: {conditionId: 'conditionId'},
                    parent: 'condition',
                    autoSelect: true,
                    selectionMode: 'single',
                    widgets: ['name', 'tag']
                },
                items: {
                    properties: {
                        splitNameId: {
                            default: {
                                function: 'max'
                            }
                        },
                        name: {},
                        tag: {}
                    }
                }
            },
            splitRange: {
                title: '',
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    master: {
                        splitNameId: 'splitNameId'
                    },
                    parent: '$.selected.splitName',
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
                title: '',
                widget: {
                    type: 'table',
                    selectionMode: 'single',
                    master: {
                        splitNameId: 'splitNameId'
                    },
                    parent: '$.selected.splitName',
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
            },
            limit: {
                title: '',
                widget: {
                    type: 'table',
                    master: {conditionId: 'conditionId'},
                    parent: 'condition',
                    selectionMode: 'single',
                    widgets: [
                        'currency',
                        'minAmount',
                        'maxAmount',
                        'maxAmountDaily',
                        'maxCountDaily',
                        'maxAmountWeekly',
                        'maxCountWeekly',
                        'maxAmountMonthly',
                        'maxCountMonthly',
                        'credentials',
                        'priority'
                    ]
                },
                items: {
                    properties: {
                        limitId: {},
                        conditionId: {},
                        currency: {},
                        minAmount: {type: 'number'},
                        maxAmount: {type: 'number'},
                        maxAmountDaily: {type: 'number'},
                        maxCountDaily: {type: 'integer'},
                        maxAmountWeekly: {type: 'number'},
                        maxCountWeekly: {type: 'integer'},
                        maxAmountMonthly: {type: 'number'},
                        maxCountMonthly: {type: 'integer'},
                        credentials: {type: 'integer'},
                        priority: {type: 'integer'}
                    }
                }
            },
            channel: {
                properties: {
                    country: {
                        widget: {type: 'multiSelect', dropdown: 'rule.country'}
                    },
                    region: {
                        widget: {type: 'multiSelect', dropdown: 'rule.region'}
                    },
                    city: {
                        widget: {type: 'multiSelect', dropdown: 'rule.city'}
                    },
                    actor: {
                        title: 'Organization',
                        widget: {
                            type: 'multiSelectTree',
                            dropdown: 'customer.organizationTreeNodes'
                        }
                    },
                    actorTag: {
                        title: 'Organization Tag',
                        widget: {type: 'chips'}
                    }
                }
            },
            operation: {
                properties: {
                    type: {
                        widget: {type: 'multiSelect', dropdown: 'rule.operation'}
                    },
                    tag: {
                        widget: {type: 'chips'}
                    }
                }
            },
            source: {
                properties: {
                    actor: {
                        title: 'Organization',
                        widget: {
                            type: 'multiSelectTree',
                            dropdown: 'customer.organizationTreeNodes'
                        }
                    },
                    actorTag: {
                        title: 'Organization Tag',
                        widget: {type: 'chips'}
                    },
                    accountProduct: {
                        widget: {type: 'multiSelect', dropdown: 'rule.accountProduct'}
                    },
                    cardProduct: {
                        widget: {type: 'multiSelect', dropdown: 'rule.cardProduct'}
                    },
                    country: {
                        widget: {type: 'multiSelect', dropdown: 'rule.country'}
                    },
                    region: {
                        widget: {type: 'multiSelect', dropdown: 'rule.region'}
                    },
                    city: {
                        widget: {type: 'multiSelect', dropdown: 'rule.city'}
                    }
                }
            },
            destination: {
                properties: {
                    actor: {
                        title: 'Organization',
                        widget: {
                            type: 'multiSelectTree',
                            dropdown: 'customer.organizationTreeNodes'
                        }
                    },
                    actorTag: {
                        title: 'Organization Tag',
                        widget: {type: 'chips'}
                    },
                    accountProduct: {
                        widget: {type: 'multiSelect', dropdown: 'rule.accountProduct'}
                    },
                    cardProduct: {
                        widget: {type: 'multiSelect', dropdown: 'rule.cardProduct'}
                    },
                    country: {
                        widget: {type: 'multiSelect', dropdown: 'rule.country'}
                    },
                    region: {
                        widget: {type: 'multiSelect', dropdown: 'rule.region'}
                    },
                    city: {
                        widget: {type: 'multiSelect', dropdown: 'rule.city'}
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
        splitName: {
            className: 'lg:col-2',
            label: 'Name',
            widgets: ['splitName']
        },
        splitRange: {
            className: 'lg:col-10',
            label: 'Amount Range',
            widgets: ['splitRange']
        },
        splitAssignment: {
            label: 'Splits',
            widgets: ['splitAssignment']
        },
        channel: {
            className: 'lg:col-4',
            label: 'Channel',
            widgets: [
                'channel.country',
                'channel.region',
                'channel.city',
                'channel.actor',
                'channel.actorTag'
            ]
        },
        operation: {
            label: 'Operation',
            widgets: [
                'condition.priority',
                'operation.type',
                'operation.tag',
                'condition.operationStartDate',
                'condition.operationEndDate'
            ]
        },
        source: {
            className: 'lg:col-4',
            label: 'Holder',
            widgets: [
                'source.country',
                'source.region',
                'source.city',
                'source.actor',
                'source.actorTag',
                'source.cardProduct',
                'source.accountProduct',
                'condition.sourceAccountId'
            ]
        },
        destination: {
            className: 'lg:col-4',
            label: 'Counterparty',
            widgets: [
                'destination.country',
                'destination.region',
                'destination.city',
                'destination.actor',
                'destination.actorTag',
                'destination.cardProduct',
                'destination.accountProduct',
                'condition.destinationAccountId'
            ]
        },
        limit: {
            className: 'lg:col-12',
            label: '',
            widgets: ['limit']
        }
    },
    layouts: {
        edit: {
            orientation: 'top',
            items: [{
                id: 'condition',
                label: 'Condition',
                widgets: [
                    'hidden',
                    ['channel', 'operation'],
                    'source',
                    'destination'
                ]
            }, {
                id: 'limit',
                label: 'Limits',
                widgets: ['limit']
            }, {
                id: 'assignment',
                label: 'Assignments',
                widgets: [
                    'splitName',
                    ['splitRange', 'splitAssignment']
                ]
            }]
        }
    }
});
