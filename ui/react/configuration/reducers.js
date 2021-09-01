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
        role: [],
        skipDisabled: [
            'itemName',
            'itemCode'
        ]
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
                    visible: false,
                    title: 'Source'
                },
                destination: {
                    visible: false,
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
                        visible: false,
                        title: 'Country'
                    },
                    region: {
                        visible: false,
                        title: 'Region'
                    },
                    city: {
                        visible: false,
                        title: 'City'
                    },
                    organization: {
                        visible: true,
                        title: 'Organization'
                    },
                    superAgent: {
                        visible: true,
                        title: 'Super Agent'
                    },
                    financialInstitution: {
                        visible: true,
                        title: 'Financial Institution'
                    },
                    agentType: {
                        visible: true,
                        title: 'Agent Type'
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
                visible: false,
                title: 'Source',
                fields: {
                    country: {
                        visible: false,
                        title: 'Country'
                    },
                    region: {
                        visible: false,
                        title: 'Region'
                    },
                    city: {
                        visible: false,
                        title: 'City'
                    },
                    organization: {
                        visible: false,
                        title: 'Organization'
                    },
                    cardProduct: {
                        visible: false,
                        title: 'Product'
                    },
                    accountProduct: {
                        visible: true,
                        title: 'Account Product'
                    }
                }
            },
            destination: {
                visible: false,
                title: 'Destination',
                fields: {
                    country: {
                        visible: false,
                        title: 'Country'
                    },
                    region: {
                        visible: false,
                        title: 'Region'
                    },
                    city: {
                        visible: false,
                        title: 'City'
                    },
                    organization: {
                        visible: false,
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
                title: 'Fee and Commission Split'
            }
        }
    }
};

const defaultStateImmutable = immutable.fromJS(defaultUiState);

export function uiConfig(state = defaultStateImmutable, action) {
    switch (action.type) {
        case actionTypes.SET_RULE_CONFIG:
            if (action.config) {
                const passedConfigAsImmutable = immutable.fromJS(action.config);
                const newConfigState = state.mergeDeep(passedConfigAsImmutable);
                return newConfigState;
            }
    }
    return state;
}

export default { uiConfig };
