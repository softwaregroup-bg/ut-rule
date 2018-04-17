import { errorMessage } from './validator';
import { defaultErrorState, emptyCumulative } from './Tabs/defaultState';
import { fromJS } from 'immutable';

export const tabs = ['channel', 'operation', 'source', 'destination', 'limit', 'split'];

export const tabTitleMap = {
    channel: 'Channel',
    operation: 'Operation',
    source: 'Source',
    destination: 'Destination',
    limit: 'Limit',
    split: 'Fee and commission split'
};
export const splitTags = [
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

const factors = {
    sourceOrganization: 'so',
    destinationOrganization: 'do',
    channelOrganization: 'co',
    sourceSpatial: 'ss',
    destinationSpatial: 'ds',
    channelSpatial: 'cs',
    operationCategory: 'oc',
    sourceCategory: 'sc',
    destinationCategory: 'dc'
};

const conditionItemFactor = {
    source: factors.sourceSpatial,
    channel: factors.channelSpatial,
    destination: factors.destinationSpatial,
    operation: factors.operationCategory
};

const conditionActorFactor = {
    source: factors.sourceOrganization,
    channel: factors.channelOrganization,
    destination: factors.destinationOrganization
};

const conditionPropertyFactor = {
    source: factors.sourceOrganization,
    channel: factors.channelOrganization,
    destination: factors.destinationOrganization,
    operation: factors.operationCategory
};

const propMap = {
    country: 'countries',
    region: 'regions',
    city: 'cities',
    operation: 'operations',
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

export const formatNomenclatures = (items) => {
    let formattedPayload = {};

    items.map(item => {
        if (!formattedPayload[item.type]) {
            formattedPayload[item.type] = [];
        }
        formattedPayload[item.type].push({
            key: item.value,
            name: item.display
        });
    });
    return formattedPayload;
};

export const prepareRuleToSave = (rule) => {
    let { operation, channel, split, limit } = rule;
    let formattedRule = {};
    let conditionId = channel.conditionId;
    formattedRule.condition = [{
        conditionId,
        priority: channel.priority,
        operationStartDate: operation.startDate || null,
        operationEndDate: operation.endDate || null,
        sourceAccontId: null,
        destinationAccountId: null
    }];
    formattedRule.conditionActor = [];
    ['channel', 'source', 'destination'].forEach(function(keyProp) {
        var value = rule[keyProp];
        ['organization', 'role'].forEach((type) => {
            value[type] && formattedRule.conditionActor.push(
                {
                    actorId: value[type],
                    conditionId,
                    factor: conditionActorFactor[keyProp]
                }
            );
        });
    });

    formattedRule.conditionItem = [];

    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        var tab = rule[tabKey];
        tab && ['cardProduct', 'accountProduct', 'cities', 'countries', 'regions', 'operations'].forEach(function(kepProp) {
            var value = tab[kepProp];
            if (value && value instanceof Array) {
                value.forEach(function(ci) {
                    ci.key && formattedRule.conditionItem.push({
                        itemNameId: ci.key,
                        conditionId,
                        factor: conditionItemFactor[tabKey]
                    });
                });
            } else if (value && !(value instanceof Object)) {
                formattedRule.conditionItem.push({
                    itemNameId: value,
                    conditionId,
                    factor: conditionItemFactor[tabKey]
                });
            }
        });
    });

    formattedRule.conditionProperty = [];

    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        var tab = rule[tabKey];
        if (tab) {
            var value = tab.properties;
            value && value.forEach(function(prop) {
                prop.name && formattedRule.conditionProperty.push({
                    conditionId,
                    factor: conditionPropertyFactor[tabKey],
                    name: prop.name,
                    value: prop.value
                });
            });
        }
    });

    formattedRule.limit = [];
    (limit || []).forEach(limit => {
        !isEmptyValuesOnly(limit) && formattedRule.limit.push({
            conditionId,
            limitId: limit.limitId,
            currency: limit.currency,
            minAmount: limit.txMin,
            maxAmount: limit.txMax,
            maxAmountDaily: limit.dailyMaxAmount,
            maxCountDaily: limit.dailyMaxCount,
            maxAmountWeekly: limit.weeklyMaxAmount,
            maxCountWeekly: limit.weeklyMaxCount,
            maxAmountMonthly: limit.monthlyMaxAmount,
            maxCountMonthly: limit.monthlyMaxCount
        });
    });

    formattedRule.split = {data: {rows: []}};
    split.splits.forEach(split => {
        if (!split.name) return;
        let formattedSplit = {};
        formattedSplit.splitName = {
            conditionId,
            splitNameId: split.splitNameId,
            name: split.name,
            tag: `|${split.tags.map(tag => tag.key).join('|')}|`
        };

        formattedSplit.splitAssignment = [];
        split.assignments.forEach((assignment) => {
            !isEmptyValuesOnly(assignment) && formattedSplit.splitAssignment.push({
                splitNameId: assignment.splitNameId,
                splitAssignmentId: assignment.splitAssignmentId,
                debit: assignment.debit,
                credit: assignment.credit,
                minValue: assignment.minAmount,
                maxValue: assignment.maxAmount,
                percent: assignment.percent,
                description: assignment.description
            });
        });

        formattedSplit.splitRange = [];

        split.cumulatives.forEach(cumulative => {
            let cum = {
                startAmountDaily: cumulative.dailyAmount,
                startCountDaily: cumulative.dailyCount,
                startAmountMonthly: cumulative.monthlyAmount,
                startCountMonthly: cumulative.monthlyCount,
                startAmountWeekly: cumulative.weeklyAmount,
                startCountWeekly: cumulative.weeklyCount,
                startAmountCurrency: cumulative.currency,
                splitNameId: cumulative.splitNameId
            };
            cumulative.ranges.forEach(range => {
                !isEmptyValuesOnly(range) && formattedSplit.splitRange.push({
                    splitRangeId: range.splitRangeId,
                    startAmount: range.startAmount,
                    isSourceAmount: false,
                    minValue: range.minAmount,
                    maxValue: range.maxAmount,
                    percent: range.percent,
                    ...cum
                });
            });
        });

        formattedRule.split.data.rows.push(formattedSplit);
    });

    return formattedRule;
};

export const prepareRuleModel = (result) => {
    var errState = fromJS(defaultErrorState).toJS();
    var condition = (result.condition || [])[0] || {};
    var rule = {
        channel: {
            conditionId: condition.conditionId,
            priority: condition.priority,
            properties: [],
            countries: [],
            cities: [],
            regions: []
        },
        destination: { properties: [], countries: [], cities: [], regions: [] },
        source: { properties: [], countries: [], cities: [], regions: [] },
        split: {
            splits: []
        },
        limit: [],
        operation: {
            operations: [],
            properties: [],
            startDate: condition.operationStartDate,
            endDate: condition.operationEndDate
        }
    };
    (result.conditionActor || []).forEach((ca) => {
        var des = rule[propMap[ca.factor]];
        des && (des[ca.type] = ca.actorId);
    });
    // condition item
    (result.conditionItem || []).forEach((item) => {
        if (['operation', 'country', 'city', 'region'].indexOf(item.type) > -1) {
            var obj = rule[propMap[item.factor]] && rule[propMap[item.factor]][propMap[item.type]];
            obj && obj.push({
                key: item.itemNameId,
                name: item.itemName
            });
        } else {
            rule[propMap[item.factor]] && (rule[propMap[item.factor]][item.type] = item.itemNameId);
        }
    });
    // condition property
    (result.conditionProperty || []).forEach((property) => {
        var obj = rule[propMap[property.factor]];
        obj && obj.properties.push({
            name: property.name,
            value: property.value
        });
    });
    // limit
    result.limit && result.limit.sort((a, b) => a.limitId > b.limitId).forEach((limit) => {
        errState.limit.push({});
        rule.limit.push({
            conditionId: condition.conditionId,
            limitId: limit.limitId,
            currency: limit.currency,
            txMin: limit.minAmount,
            txMax: limit.maxAmount,
            dailyMaxAmount: limit.maxAmountDaily,
            dailyMaxCount: parseInt(limit.maxCountDaily) || '',
            weeklyMaxAmount: limit.maxAmountWeekly,
            weeklyMaxCount: parseInt(limit.maxCountWeekly) || '',
            monthlyMaxAmount: limit.maxAmountMonthly,
            monthlyMaxCount: parseInt(limit.maxCountMonthly) || ''
        });
    });
    // split
    result.splitName && result.splitName.forEach((splitName) => {
        if (!splitName.name) return;
        let splitNameId = splitName.splitNameId;
        var split = {
            conditionId: condition.conditionId,
            name: splitName.name,
            splitNameId,
            tags: [],
            cumulatives: [],
            assignments: []
        };
        splitName.tag && splitName.tag.split('|').filter((ts) => !!ts).forEach((tagName) => {
            var splitTag = splitTags.find((st) => st.key === tagName);
            splitTag && split.tags.push(splitTag);
        });
        var splitRange = result.splitRange && result.splitRange.filter((range) => range.splitNameId === splitNameId);
        if (splitRange.length > 0) {
            let uniqueCurrencies = []; // ideally its good to split the cumulatives by cumulative id
            var cumulatives = splitRange.filter((cum) => {
                if (cum.startAmountCurrency && uniqueCurrencies.includes(cum.startAmountCurrency)) return false;
                else if (cum.startAmountCurrency) {
                    uniqueCurrencies.push(cum.startAmountCurrency);
                    return true;
                } else return false;
            });
            cumulatives.forEach(function(range) {
                var cumulative = {
                    splitNameId,
                    currency: range.startAmountCurrency,
                    dailyCount: parseInt(range.startCountDaily) || '',
                    dailyAmount: range.startAmountDaily,
                    weeklyCount: parseInt(range.startCountWeekly) || '',
                    weeklyAmount: range.startAmountWeekly,
                    monthlyCount: parseInt(range.startCountMonthly) || '',
                    monthlyAmount: range.startAmountMonthly,
                    ranges: []
                };
                splitRange.forEach((srange) => {
                    range.startAmountCurrency === srange.startAmountCurrency && cumulative.ranges.push({
                        splitRangeId: srange.splitRangeId,
                        startAmount: srange.startAmount,
                        minAmount: srange.minValue,
                        maxAmount: srange.maxValue,
                        percent: srange.percent,
                        isSourceAmount: srange.isSourceAmount
                    });
                });
                split.cumulatives.push(cumulative);
            });
        } else {
            split.cumulatives.push(emptyCumulative);
        }
        result.splitAssignment && result.splitAssignment.filter((sa) => sa.splitNameId === splitNameId).forEach((assignment) => {
            split.assignments.push({
                splitNameId: assignment.splitNameId,
                splitAssignmentId: assignment.splitAssignmentId,
                debit: assignment.debit,
                credit: assignment.credit,
                minAmount: assignment.minValue,
                maxAmount: assignment.maxValue,
                percent: assignment.percent,
                description: assignment.description
            });
        });
        rule.split.splits.push(split);
    });
    errState.split.splits = [];
    rule.split.splits.forEach((split) => {
        errState.split.splits.push({
            tags: [],
            assignments: Array(split.assignments.length).fill({}),
            cumulatives: [{
                ranges: Array((((split.cumulatives[0] || {}).ranges || [])).length).fill({})
            }]
        });
    });
    errState.limit = Array(rule.limit.length).fill({});
    tabs.forEach((tk) => {
        rule[tk] && rule[tk].properties && (errState[tk].properties = Array(rule[tk].properties.length).fill({}));
    });
    rule.errors = errState;
    return rule;
};

export const prepareRuleErrors = (rule, existErrors) => {
    var errors = fromJS(existErrors || defaultErrorState);
    let { destination, source, operation, channel, split, limit } = rule;
    channel && !channel.priority && (errors = errors.setIn(['channel', 'priority'], errorMessage.priorityRequired));
    channel && channel.properties && channel.properties.forEach((prop, idx) => {
        prop.value && !prop.name && (errors = errors.setIn(['channel', 'properties', idx, 'name'], errorMessage.propertyNameRequired));
    });
    source && source.properties && source.properties.forEach((prop, idx) => {
        prop.value && !prop.name && (errors = errors.setIn(['source', 'properties', idx, 'name'], errorMessage.propertyNameRequired));
    });
    destination && destination.properties && destination.properties.forEach((prop, idx) => {
        prop.value && !prop.name && (errors = errors.setIn(['destination', 'properties', idx, 'name'], errorMessage.propertyNameRequired));
    });
    operation && operation.properties && operation.properties.forEach((prop, idx) => {
        prop.value && !prop.name && (errors = errors.setIn(['operation', 'properties', idx, 'name'], errorMessage.propertyNameRequired));
    });
    limit && limit.forEach((lim, idx) => {
        !lim.currency && !isEmptyValuesOnly(lim) && (errors = errors.setIn(['limit', idx, 'currency'], errorMessage.currencyRequired));
    });
    split && split.splits.forEach((split, idx) => {
        let isEmptySplit = isEmptyValuesOnly(split);
        if (!isEmptySplit) {
            // info
            !split.name && (errors = errors.setIn(['split', 'splits', idx, 'name'], errorMessage.splitNameRequired));
            // assignement
            split && split.assignments && split.assignments.forEach((ass, assidx) => {
                ass && !ass.description && !isEmptyValuesOnly(ass) &&
                    (errors = errors.setIn(['split', 'splits', idx, 'assignments', assidx, 'description'], errorMessage.descriptionRequired));
                ass && !ass.credit && !isEmptyValuesOnly(ass) &&
                    (errors = errors.setIn(['split', 'splits', idx, 'assignments', assidx, 'credit'], errorMessage.creditRequired));
            });
            // cumulative
            split.cumulatives.forEach(function(cumulative, cidx) {
                cumulative && !cumulative.currency && !isEmptyValuesOnly(cumulative) &&
                (errors = errors.setIn(['split', 'splits', idx, 'cumulatives', cidx, 'currency'], errorMessage.currencyRequired));

                // ranges
                cumulative && cumulative.ranges && cumulative.ranges.forEach(function(range, ridx) {
                    if (ridx === 0) {
                        cumulative.currency && !range.startAmount &&
                            (errors = errors.setIn(['split', 'splits', idx, 'cumulatives', cidx, 'ranges', ridx, 'startAmount'], errorMessage.startAmountRequired));
                    } else {
                        range && !isEmptyValuesOnly(range) && !range.startAmount &&
                            (errors = errors.setIn(['split', 'splits', idx, 'cumulatives', cidx, 'ranges', ridx, 'startAmount'], errorMessage.startAmountRequired));
                    }
                });
            });
        }
    });
    return errors.toJS();
};

export const getRuleProperties = (rule = {}) => {
    var properties = [];
    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        var tab = rule[tabKey];
        if (tab) {
            var value = tab.properties;
            value && (properties = properties.concat(value));
        }
    });
    return properties;
};

export const isEmptyValuesOnly = (obj) => {
    var tempIsEmpty = true;
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((objKey) => {
            if (!isEmptyValuesOnly(obj[objKey])) {
                tempIsEmpty = false;
                return false;
            }
        });
    } else tempIsEmpty = !obj;
    return tempIsEmpty;
};

export const diff = (obj1, obj2) => {
    var diffObj = {};
    for (var prop in obj1) {
        if (obj1.hasOwnProperty(prop) && prop !== '__proto__') {
            if (!obj2.hasOwnProperty(prop)) diffObj[prop] = obj1[prop];
            else if (obj1[prop] === Object(obj1[prop])) {
                var difference = diff(obj1[prop], obj2[prop]);
                if (Object.keys(difference).length > 0) diffObj[prop] = difference;
            } else if (obj1[prop] !== obj2[prop]) {
                if (obj1[prop] === undefined) diffObj[prop] = 'undefined';
                if (obj1[prop] === null) diffObj[prop] = null;
                else if (typeof obj1[prop] === 'function') diffObj[prop] = 'function';
                else if (typeof obj1[prop] === 'object') diffObj[prop] = 'object';
                else diffObj[prop] = obj1[prop];
            }
        }
    }
    return diffObj;
};

export const isEqual = (x, y) => {
    if ((typeof x === 'object' && x != null) && (typeof y === 'object' && y != null)) {
        if (Object.keys(x).length !== Object.keys(y).length) return false;
        for (var prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!isEqual(x[prop], y[prop])) return false;
            } // else return false;
        }
        return true;
    } else if (String(x || null) !== String(y || null)) return false;
    else return true;
};

export const getRuleErrorCount = (errors) => {
    let flattenObj = flatten(errors);
    let errorCount = {};
    tabs.map((tab) => {
        errorCount[tab] = Object.keys(flattenObj).filter((fkey) => flattenObj[fkey] && fkey.startsWith(tab)).length;
    });
    return errorCount;
};

export const flatten = function(ob) {
    var result = {};
    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if ((typeof ob[i]) === 'object') {
            var flatObject = flatten(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                result[i + '.' + x] = flatObject[x];
            }
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};
