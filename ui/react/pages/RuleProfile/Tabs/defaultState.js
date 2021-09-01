export const emptyRange = {
    startAmount: '',
    percent: '',
    minAmount: '',
    maxAmount: ''
};
export const emptyCumulative = {
    currency: '',
    dailyCount: null,
    dailyAmount: '',
    weeklyCount: null,
    weeklyAmount: '',
    monthlyCount: null,
    monthlyAmount: '',
    ranges: [emptyRange]
};
export const emptySplit = {
    name: '',
    tags: [],
    cumulatives: [emptyCumulative],
    assignments: []
};
export const emptyAssignment = {
    description: '',
    debit: '',
    credit: '',
    percent: '',
    minAmount: '',
    maxAmount: ''
};
export const emptyLimit = {
    currency: '',
    txMin: null,
    txMax: null,
    dailyMaxAmount: null,
    dailyMaxCount: null,
    weeklyMaxAmount: null,
    weeklyMaxCount: null,
    monthlyMaxAmount: null,
    monthlyMaxCount: null
};

export const defaultErrorState = {
    channel: {properties: []},
    destination: {properties: []},
    limit: [],
    operation: {properties: []},
    source: {properties: []},
    split: {
        splits: [{
            tags: [],
            assignments: [],
            cumulatives: [{
                ranges: []
            }]
        }]
    }
};

export const defaultTabState = {
    errors: defaultErrorState,
    hasChanged: false,
    activeTab: 0,
    channel: {
        priority: '',
        countries: [],
        regions: [],
        cities: [],
        organization: '',
        role: null,
        properties: [],
        superAgent: null,
        financialInstitution: null
    },
    destination: {
        countries: [],
        regions: [],
        cities: [],
        organization: '',
        role: null,
        properties: [],
        accountProduct: null
    },
    limit: [],
    operation: {
        operations: [],
        startDate: null,
        endDate: null,
        properties: []
    },
    source: {
        countries: [],
        regions: [],
        cities: [],
        organization: '',
        role: null,
        cardProducts: [],
        accountProduct: null,
        properties: []
    },
    split: {
        splits: [
            {
                name: '',
                tags: [],
                cumulatives: [emptyCumulative],
                assignments: []
            }
        ]
    }
};
