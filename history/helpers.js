const splitTags = [
    {key: 'acquirer', name: 'Acquirer'},
    {key: 'issuer', name: 'Issuer'},
    {key: 'commission', name: 'Commission'},
    {key: 'realtime', name: 'Realtime posting'},
    {key: 'pending', name: 'Authorization required'},
    {key: 'agent', name: 'Agent'},
    {key: 'fee', name: 'Fee'},
    {key: 'atm', name: 'ATM'},
    {key: 'pos', name: 'POS'},
    {key: 'ped', name: 'PED'},
    {key: 'vendor', name: 'Vendor'},
    {key: 'merchant', name: 'Merchant'}
];

const propMap = {
    country: 'Country',
    region: 'Region',
    city: 'City',
    operation: 'Operation',
    so: 'source',
    do: 'destination',
    co: 'channel',
    ss: 'source',
    ds: 'destination',
    cs: 'channel',
    oc: 'operation',
    sc: 'source',
    dc: 'destination'
};

const prepareRuleModel = (result) => {
    var condition = (result.condition || [])[0] || {};
    var rule = {
        channel: {
            Priority: condition.priority,
            Country: [],
            Region: [],
            City: [],
            Properties: []
        },
        destination: {
            Country: [],
            Region: [],
            City: [],
            Properties: []
        },
        source: {
            Country: [],
            Region: [],
            City: [],
            Properties: [] },
        split: {
            Split: []
        },
        limit: [],
        operation: {
            Operation: [],
            'Start Date': condition.operationStartDate,
            'End Date': condition.operationEndDate,
            Properties: []
        }
    };
    (result.conditionActor || []).forEach((ca) => {
        var des = rule[propMap[ca.factor]];
        des && (des['Organization'] = ca.organizationName);
    });
    (result.conditionItem || []).filter((prod) => prod.type === 'cardProduct' || prod.type === 'accountProduct').forEach((cp) => {
        var product = rule[propMap[cp.factor]] || rule[propMap[cp.factor]][propMap[cp.type]];
        product && (cp.type === 'cardProduct') ? product['Product'] = cp.itemName : product['Account Product'] = cp.itemName;
    });
    (result.conditionItem || []).forEach((item) => {
        if (['operation', 'country', 'city', 'region'].indexOf(item.type) > -1) {
            var obj = rule[propMap[item.factor]] && rule[propMap[item.factor]][propMap[item.type]];
            obj && obj.push(item.itemName);
        } else {
            rule[propMap[item.factor]] && (rule[propMap[item.factor]][item.type] = item.itemNameId);
        }
    });
    (result.conditionProperty || []).forEach((property) => {
        var obj = rule[propMap[property.factor]];
        obj && obj.Properties.push({
            Name: property.name,
            Value: property.value
        });
    });
    result.limit && result.limit.sort((a, b) => a.limitId > b.limitId).forEach((limit) => {
        rule.limit.push({
            Currency: limit.currency,
            'Transaction Amount Min': limit.minAmount,
            'Transaction Amount Max': limit.maxAmount,
            'Daily Max Amount': limit.maxAmountDaily,
            'Daily Max Count': limit.maxCountDaily,
            'Weekly Max Amount': limit.maxAmountWeekly,
            'Weekly Max Count': limit.maxCountWeekly,
            'Monthly Max Amount': limit.maxAmountMonthly,
            'Monthly Max Count': limit.maxCountMonthly
        });
    });
    result.splitName && result.splitName.forEach((splitName) => {
        if (!splitName.name) return;
        let splitNameId = splitName.splitNameId;
        var split = {
            'Split Name': splitName.name,
            Tag: [],
            Cumulative: [],
            Assignment: []
        };
        splitName.tag && splitName.tag.split('|').filter((ts) => !!ts).forEach((tagName) => {
            var splitTag = splitTags.find((st) => st.key === tagName);
            splitTag && split.Tag.push(splitTag.name);
        });
        var splitRange = result.splitRange && result.splitRange.filter((range) => range.splitNameId === splitNameId);
        if (splitRange.length > 0) {
            var range = splitRange[0];
            var cumulative = {
                Currency: range.startAmountCurrency,
                'Daily Count': range.startCountDaily,
                'Daily Amount': range.startAmountDaily,
                'Weekly Count': range.startCountWeekly,
                'Weekly Amount': range.startAmountWeekly,
                'Monthly Count': range.startCountMonthly,
                'Monthly Amount': range.startAmountMonthly,
                Range: []
            };
            splitRange.forEach((srange) => {
                cumulative.Range.push({
                    'Start Amount': srange.startAmount,
                    Percent: srange.percent,
                    'Min Amount': srange.minValue,
                    'Max Amount': srange.maxValue
                });
            });
            split.Cumulative.push(cumulative);
        }
        result.splitAssignment && result.splitAssignment.filter((sa) => sa.splitNameId === splitNameId).forEach((assignment) => {
            split.Assignment.push({
                Description: assignment.description,
                Debit: assignment.debit,
                Credit: assignment.credit,
                Percent: assignment.percent,
                'Min Amount': assignment.minValue,
                'Max Amount': assignment.maxValue
            });
        });
        rule.split.Split.push(split);
    });
    return rule;
};

module.exports = {
    prepareRuleModel
};
