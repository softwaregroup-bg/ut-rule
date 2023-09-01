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
            'account',
            'agentRole'
        ],
        itemCode: [
            'currency'
        ],
        agentRole: [''],
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
                status: {
                    visible: true,
                    title: 'Status'
                },
                lock: {
                    visible: true,
                    title: 'Lock'
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
                    },
                    agentRole: {
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
