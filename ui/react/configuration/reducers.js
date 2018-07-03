import * as actionTypes from './actionTypes';
import immutable from 'immutable';

const defaultUiState = {
    nomenclatures: {
        itemName: [
            'country',
            'channel',
            'region',
            'city',
            'organization',
            'role',
            'operation',
            'supervisor',
            'cardProduct',
            'accountProduct',
            'account'
        ],
        itemCode: [
            'currency'
        ],
        agentRole: [],
        accountAlias: [],
        organization: [''],
        role: []
    },
    main: {
        grid: {
            columns: {
                priority: {
                    visible: true,
                    title: 'Priority'
                },
                channel: {
                    visible: true,
                    title: 'Channel'
                },
                operation: {
                    visible: true,
                    title: 'Operation'
                },
                source: {
                    visible: true,
                    title: 'Source'
                },
                destination: {
                    visible: true,
                    title: 'Destination'
                },
                limit: {
                    visible: true,
                    title: 'Limit'
                },
                split: {
                    visible: true,
                    title: 'Split'
                },
                expansion: {
                    visible: true,
                    title: 'Expansion'
                }
            }
        }
    },
    profile: {
        tabs: {
            channel: {
                visible: true,
                title: 'Channel',
                fields: {
                    country: {
                        visible: true,
                        title: 'Country'
                    },
                    region: {
                        visible: true,
                        title: 'Region'
                    },
                    city: {
                        visible: true,
                        title: 'City'
                    },
                    organization: {
                        visible: true,
                        title: 'Organization'
                    }
                }
            },
            operation: {
                visible: true,
                title: 'Operation',
                fields: {
                    operationStartDate: {
                        visible: true,
                        title: 'Start Date'
                    },
                    operationEndDate: {
                        visible: true,
                        title: 'End Date'
                    },
                    operation: {
                        visible: true,
                        title: 'Operation'
                    }
                }
            },
            source: {
                visible: true,
                title: 'Source',
                fields: {
                    country: {
                        visible: true,
                        title: 'Country'
                    },
                    region: {
                        visible: true,
                        title: 'Region'
                    },
                    city: {
                        visible: true,
                        title: 'City'
                    },
                    organization: {
                        visible: true,
                        title: 'Organization'
                    },
                    cardProduct: {
                        visible: true,
                        title: 'Product'
                    },
                    accountProduct: {
                        visible: true,
                        title: 'Account Product'
                    }
                }
            },
            destination: {
                visible: true,
                title: 'Destination',
                fields: {
                    country: {
                        visible: true,
                        title: 'Country'
                    },
                    region: {
                        visible: true,
                        title: 'Region'
                    },
                    city: {
                        visible: true,
                        title: 'City'
                    },
                    organization: {
                        visible: true,
                        title: 'Organization'
                    },
                    accountProduct: {
                        visible: true,
                        title: 'Account Product'
                    }
                }
            },
            limit: {
                visible: true,
                title: 'Limit'
            },
            split: {
                visible: true,
                title: 'Fee and Commission Split',
                assignmentFields: {
                    description: {
                        visible: true,
                        title: 'Description'
                    },
                    debit: {
                        visible: true,
                        title: 'Debit'
                    },
                    debitAlias: {
                        visible: false,
                        title: 'Debit'
                    },
                    credit: {
                        visible: true,
                        title: 'Credit'
                    },
                    creditAlias: {
                        visible: false,
                        title: 'Credit'
                    },
                    percent: {
                        visible: true,
                        title: '%'
                    },
                    minValue: {
                        visible: true,
                        title: 'Min Amount'
                    },
                    maxValue: {
                        visible: true,
                        title: 'Max Amount'
                    }
                }
            }
        }
    }
};

const defaultStateImmutable = immutable.fromJS(defaultUiState);

export function uiConfig(state = defaultStateImmutable, action) {
    switch (action.type) {
        case actionTypes.SET_RULE_CONFIG:
            if (action.config) {
                let passedConfigAsImmutable = immutable.fromJS(action.config);
                let newConfigState = state.mergeDeep(passedConfigAsImmutable);
                return newConfigState;
            }
    }

    return state;
}

export default { uiConfig };
