export const emptyCumulative = {
    currency: '',
    dailyCount: '',
    dailyAmount: '',
    weeklyCount: '',
    weeklyAmount: '',
    monthlyCount: '',
    monthlyAmount: '',
    ranges: []
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
export const emptyRange = {
    startAmount: '',
    percent: '',
    minAmount: '',
    maxAmount: ''
};

export const emptyLimit = {
    currency: '',
    txMin: '',
    txMax: '',
    dailyMaxAmount: '',
    dailyMaxCount: '',
    weeklyMaxAmount: '',
    weeklyMaxCount: '',
    monthlyMaxAmount: '',
    monthlyMaxCount: ''
};

export const defaultTabState = {
    channel: {
        priority: '',
        countries: [],
        regions: [],
        cities: [],
        organization: '',
        properties: []
    },
    destination: {
        countries: [],
        regions: [],
        cities: [],
        organization: '',
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
        cardProduct: null,
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
