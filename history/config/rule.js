const conditionItemTransform = (value) => ((value || []).filter(({name}) => !!name).map(({name}) => name).join(', '));
const propertyTransform = (props) => ((props || []).map((prop) => ({Name: prop.name, Value: prop.value})));
const assignment = (assignments) => (
    (assignments || {}).filter((value) => !!value).map((ass) => ({
        Description: ass.description,
        Debit: ass.debit,
        Credit: ass.credit,
        'Percent (%)': ass.percent,
        'Min Amount': ass.minAmount,
        'Max Amount': ass.maxAmount
    }))
);
const cumulative = (cumulatives) => (
    (cumulatives || []).filter((value) => !!value).map((cum) => ({
        Currency: cum.currency,
        'Daily Count': cum.dailyCount,
        'Daily Amount': cum.dailyAmount,
        'Weekly Count': cum.weeklyCount,
        'Weekly Amount': cum.weeklyAmount,
        'Monthly Count': cum.monthlyCount,
        'Monthly Amount': cum.monthlyAmount,
        Range: (cum.ranges || []).map((range) => ({
            'Start Amount': range.startAmount,
            'Percent (%)': range.percent,
            'Min Amount': range.minAmount,
            'Max Amount': range.maxAmount
        }))
    }))
);
module.exports = {
    Priority: {
        keys: [
            {key: 'channel,priority', title: 'Priority'}
        ],
        single: true
    },
    Channel: {
        keys: [
            {key: 'channel,countries', title: 'Country', transform: conditionItemTransform},
            {key: 'channel,regions', title: 'Region', transform: conditionItemTransform},
            {key: 'channel,cities', title: 'City', transform: conditionItemTransform},
            {key: 'channel,organization', title: 'Organization'},
            {key: 'channel,properties', title: 'Properties', transform: propertyTransform}
        ],
        single: true
    },
    Source: {
        keys: [
            {key: 'source,countries', title: 'Country', transform: conditionItemTransform},
            {key: 'source,regions', title: 'Region', transform: conditionItemTransform},
            {key: 'source,cities', title: 'City', transform: conditionItemTransform},
            {key: 'source,organization', title: 'Organization'},
            {key: 'source,cardProducts', title: 'Product', transform: conditionItemTransform},
            {key: 'source,cardTypes', title: 'Type', transform: conditionItemTransform},
            {key: 'source,accountProduct', title: 'Account Product'},
            {key: 'source,properties', title: 'Properties', transform: propertyTransform}
        ],
        single: true
    },
    Destination: {
        keys: [
            {key: 'destination,countries', title: 'Country', transform: conditionItemTransform},
            {key: 'destination,regions', title: 'Region', transform: conditionItemTransform},
            {key: 'destination,cities', title: 'City', transform: conditionItemTransform},
            {key: 'destination,organization', title: 'Organization'},
            {key: 'destination,accountProduct', title: 'Account Product'},
            {key: 'destination,properties', title: 'Properties', transform: propertyTransform}
        ],
        single: true
    },
    Operation: {
        keys: [
            {key: 'operation,operations', title: 'Operation', transform: conditionItemTransform},
            {key: 'operation,startDate', title: 'Start Date', transform: (value) => { return value ? new Date(value).toLocaleDateString() : null; }},
            {key: 'operation,endDate', title: 'End Date', transform: (value) => { return value ? new Date(value).toLocaleDateString() : null; }},
            {key: 'operation,properties', title: 'Properties', transform: propertyTransform}
        ],
        single: true
    },
    Limit: {
        keys: [
            {key: 'limit,currency', title: 'Currency'},
            {key: 'limit,txMin', title: 'Transaction Amount Min'},
            {key: 'limit,txMax', title: 'Transaction Amount Max'},
            {key: 'limit,dailyMaxAmount', title: 'Daily Max Amount'},
            {key: 'limit,dailyMaxCount', title: 'Daily Max Count'},
            {key: 'limit,weeklyMaxAmount', title: 'Weekly Max Amount'},
            {key: 'limit,weeklyMaxCount', title: 'Weekly Max Count'},
            {key: 'limit,monthlyMaxAmount', title: 'Monthly Max Amount'},
            {key: 'limit,monthlyMaxCount', title: 'Monthly Max Count'}
        ],
        single: false
    },
    Split: {
        keys: [
            {key: 'split,name', title: 'Split Name'},
            {key: 'split,tags', title: 'Tags', transform: conditionItemTransform},
            {key: 'split,cumulatives', title: 'Cumulative', transform: cumulative},
            {key: 'split,assignments', title: 'Assignments', transform: assignment}
        ],
        single: false
    }
};
