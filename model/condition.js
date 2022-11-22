/** @type { import('ut-model').model<'rule', 'condition'> } */
module.exports = ({joi}) => ({
    subject: 'rule',
    object: 'condition',
    objectTitle: 'Rule',
    browser: {
        fetch: ({condition, paging}) => ({...condition, ...paging})
    },
    nameField: 'condition.name',
    schema: {
        properties: {
            condition: {
                properties: {
                    conditionId: {},
                    name: {},
                    description: {},
                    notes: {},
                    priority: {type: 'integer', title: 'Priority'},
                    operationEndDate: {title: 'End Date', widget: {type: 'date-time'}},
                    operationStartDate: {title: 'Start Date', widget: {type: 'date-time'}},
                    channel: {widget: {type: 'json', keyValue: true, fieldClass: 'justify-content-start'}},
                    operation: {widget: {type: 'json', keyValue: true, fieldClass: 'justify-content-start'}},
                    source: {widget: {type: 'json', keyValue: true, fieldClass: 'justify-content-start'}},
                    destination: {widget: {type: 'json', keyValue: true, fieldClass: 'justify-content-start'}},
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
                    label: 'Name',
                    master: {conditionId: 'conditionId'},
                    parent: 'condition',
                    autoSelect: true,
                    selectionMode: 'single',
                    hidden: [
                        'conditionId',
                        'splitNameId',
                        'tag'
                    ],
                    widgets: ['name']
                },
                items: {
                    properties: {
                        splitNameId: {
                            default: {
                                function: 'min'
                            }
                        },
                        name: {},
                        tag: {
                            title: '',
                            widget: {
                                type: 'multiSelectPanel',
                                itemClassName: 'col-2',
                                options: [
                                    {value: 'acquirer', label: 'Acquirer'},
                                    {value: 'issuer', label: 'Issuer'},
                                    {value: 'commission', label: 'Commission'},
                                    {value: 'realtime', label: 'Realtime posting'},
                                    {value: 'pending', label: 'Authorization required'},
                                    {value: 'agent', label: 'Agent'},
                                    {value: 'fee', label: 'Fee'},
                                    {value: 'atm', label: 'ATM'},
                                    {value: 'pos', label: 'POS'},
                                    {value: 'ped', label: 'PED'},
                                    {value: 'vendor', label: 'Vendor'},
                                    {value: 'merchant', label: 'Merchant'}
                                ]
                            }
                        }
                    }
                }
            },
            splitRange: {
                title: '',
                widget: {
                    type: 'table',
                    label: 'Amount Range',
                    selectionMode: 'single',
                    master: {
                        splitNameId: 'splitNameId'
                    },
                    parent: '$.selected.splitName',
                    hidden: [
                        'splitRangeId',
                        'splitNameId'
                    ],
                    widgets: [
                        'startAmountCurrency',
                        'startAmount',
                        'startAmountDaily',
                        'startCountDaily',
                        'startAmountWeekly',
                        'startCountWeekly',
                        'startAmountMonthly',
                        'startCountMonthly',
                        'minValue',
                        'maxValue',
                        'percent',
                        'percentBase'
                    ]
                },
                items: {
                    properties: {
                        splitRangeId: {
                            default: {
                                function: 'min'
                            }
                        },
                        splitNameId: {},
                        startAmountCurrency: {},
                        startAmount: {widget: {type: 'currency'}},
                        startAmountDaily: {widget: {type: 'currency'}},
                        startAmountMonthly: {widget: {type: 'currency'}},
                        startAmountWeekly: {widget: {type: 'currency'}},
                        startCountDaily: {type: 'integer'},
                        startCountMonthly: {type: 'integer'},
                        startCountWeekly: {type: 'integer'},
                        minValue: {widget: {type: 'currency'}},
                        maxValue: {widget: {type: 'currency'}},
                        percent: {type: 'number', widget: {minFractionDigits: 2}},
                        percentBase: {type: 'number', widget: {type: 'currency'}}
                    }
                }
            },
            splitAssignment: {
                title: '',
                widget: {
                    type: 'table',
                    label: 'Splits',
                    selectionMode: 'single',
                    master: {
                        splitNameId: 'splitNameId'
                    },
                    hidden: [
                        'splitAssignmentId',
                        'splitNameId'
                    ],
                    parent: '$.selected.splitName',
                    widgets: ['description', 'debit', 'credit', 'percent', 'minValue', 'maxValue']
                },
                items: {
                    properties: {
                        splitAssignmentId: {
                            default: {
                                function: 'min'
                            }
                        },
                        splitNameId: {},
                        description: {},
                        debit: {},
                        credit: {},
                        minValue: {widget: { type: 'currency'}},
                        maxValue: {widget: { type: 'currency'}},
                        percent: {type: 'number'}
                    }
                }
            },
            splitAnalytic: {
                title: '',
                widget: {
                    type: 'table',
                    label: 'Split Tags',
                    selectionMode: 'single',
                    master: {
                        splitAssignmentId: 'splitAssignmentId'
                    },
                    hidden: [
                        'splitAssignmentId',
                        'splitAnalyticId'
                    ],
                    parent: '$.selected.splitAssignment',
                    widgets: ['name', 'value']
                },
                items: {
                    properties: {
                        splitAssignmentId: {},
                        name: {},
                        value: {}
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
                    customerType: {
                        widget: {type: 'multiSelect', dropdown: 'customer.customerType'}
                    },
                    kyc: {
                        title: 'KYC',
                        widget: {type: 'multiSelect', dropdown: 'customer.kyc'}
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
                    customerType: {
                        widget: {type: 'multiSelect', dropdown: 'customer.customerType'}
                    },
                    kyc: {
                        title: 'KYC',
                        widget: {type: 'multiSelect', dropdown: 'customer.kyc'}
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
            history: {
                widget: {
                    params: {object: 'rule', id: '${condition.conditionId}'} // eslint-disable-line no-template-curly-in-string
                }
            }
        }
    },
    cards: {
        browse: {
            label: 'Fees, Commissions and Limits (FCL)',
            widgets: [
                'condition.name',
                'condition.priority',
                'condition.channel',
                'condition.operation',
                'condition.source',
                'condition.destination'
            ]
        },
        splitName: {
            className: 'lg:col-2',
            widgets: ['splitName']
        },
        splitTag: {
            className: 'lg:col-10',
            label: 'Tags',
            widgets: ['$.edit.splitName.tag']
        },
        splitRange: {
            className: 'lg:col-10',
            widgets: ['splitRange']
        },
        splitAssignment: {
            className: 'lg:col-6',
            widgets: ['splitAssignment']
        },
        splitAnalytic: {
            className: 'lg:col-4',
            widgets: ['splitAnalytic']
        },
        condition: {
            className: 'lg:col-4',
            label: 'Condition',
            widgets: [
                'condition.name',
                'condition.priority'
            ]
        },
        channel: {
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
                'source.customerType',
                'source.kyc',
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
                'destination.customerType',
                'destination.kyc',
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
                    ['condition', 'channel', 'operation'],
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
                    ['splitTag', 'splitRange'],
                    {className: 'lg:col-2'},
                    'splitAssignment',
                    'splitAnalytic'
                ]
            }, {
                icon: 'pi pi-history',
                label: 'History',
                id: 'history',
                widgets: ['history']
            }]
        }
    }
});
