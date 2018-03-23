import { errorMessage } from './validator';
import { defaultErrorState } from './Tabs/defaultState';
import { fromJS } from 'immutable';
import { splitTags } from '../../../../config';

export const tabs = ['channel', 'operation', 'source', 'destination', 'limit', 'split'];

export const tabTitleMap = {
    channel: 'Channel',
    operation: 'Operation',
    source: 'Source',
    destination: 'Destination',
    limit: 'Limit',
    split: 'Fee and commission split'
};

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

export const prepateRuleToSave = ({
    destination,
    source,
    operation,
    channel,
    split,
    limit
}) => {
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
    channel.organization && formattedRule.conditionActor.push(
        {
            actorId: channel.organization,
            conditionId,
            factor: factors.channelOrganization
        }
    );
    source.organization && formattedRule.conditionActor.push(
        {
            conditionId,
            actorId: source.organization,
            factor: factors.sourceOrganization
        }
    );
    destination.organization && formattedRule.conditionActor.push(
        {
            conditionId,
            actorId: destination.organization,
            factor: factors.destinationOrganization
        }
    );

    formattedRule.conditionItem = [];

    channel.cities.forEach(city => {
        formattedRule.conditionItem.push({
            itemNameId: city.key,
            conditionId,
            factor: factors.channelSpatial
        });
    });

    channel.countries.forEach(country => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: country.key,
            factor: factors.channelSpatial
        });
    });

    channel.regions.forEach(region => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: region.key,
            factor: factors.channelSpatial
        });
    });

    destination.cities.forEach(city => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: city.key,
            factor: factors.destinationSpatial
        });
    });

    destination.countries.forEach(country => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: country.key,
            factor: factors.destinationSpatial
        });
    });

    destination.regions.forEach(region => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: region.key,
            factor: factors.destinationSpatial
        });
    });

    source.cities.forEach(city => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: city.key,
            factor: factors.sourceSpatial
        });
    });

    source.countries.forEach(country => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: country.key,
            factor: factors.sourceSpatial
        });
    });

    source.regions.forEach(region => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: region.key,
            factor: factors.sourceSpatial
        });
    });

    operation.operations.forEach(operation => {
        formattedRule.conditionItem.push({
            conditionId,
            itemNameId: operation.key,
            factor: factors.operationCategory
        });
    });

    source.cardProduct && formattedRule.conditionItem.push({
        conditionId,
        factor: factors.sourceSpatial,
        itemNameId: source.cardProduct
    });
    source.accountProduct && formattedRule.conditionItem.push({
        conditionId,
        factor: factors.sourceSpatial,
        itemNameId: source.accountProduct
    });
    destination.accountProduct && formattedRule.conditionItem.push({
        conditionId,
        factor: factors.destinationSpatial,
        itemNameId: destination.accountProduct
    });

    formattedRule.conditionProperty = [];

    source.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            conditionId,
            factor: factors.sourceOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    operation.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            conditionId,
            factor: factors.operationCategory,
            name: prop.name,
            value: prop.value
        });
    });

    channel.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            conditionId,
            factor: factors.channelOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    destination.properties.forEach(prop => {
        formattedRule.conditionProperty.push({
            conditionId,
            factor: factors.destinationOrganization,
            name: prop.name,
            value: prop.value
        });
    });

    formattedRule.limit = [];
    (limit || []).forEach(limit => {
        formattedRule.limit.push({
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

        formattedSplit.splitAssignment = [
            ...split.assignments.map(assignment => ({
                splitNameId: assignment.splitNameId,
                splitAssignmentId: assignment.splitAssignmentId,
                debit: assignment.debit,
                credit: assignment.credit,
                minValue: assignment.minAmount,
                maxValue: assignment.maxAmount,
                percent: assignment.percent,
                description: assignment.description
            }))
        ];

        formattedSplit.splitRange = [];

        split.cumulatives.forEach(cumulative => {
            cumulative.ranges.forEach(range => {
                formattedSplit.splitRange.push({
                    splitRangeId: range.splitRangeId,
                    splitNameId: cumulative.splitNameId,
                    startAmount: range.startAmount,
                    isSourceAmount: false,
                    minValue: range.minAmount,
                    maxValue: range.maxAmount,
                    percent: range.percent,
                    startAmountDaily: cumulative.dailyAmount,
                    startCountDaily: cumulative.dailyCount,
                    startAmountMonthly: cumulative.monthlyAmount,
                    startCountMonthly: cumulative.monthlyCount,
                    startAmountWeekly: cumulative.weeklyAmount,
                    startCountWeekly: cumulative.weeklyCount,
                    startAmountCurrency: cumulative.currency
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
            dailyMaxCount: limit.maxCountDaily,
            weeklyMaxAmount: limit.maxAmountWeekly,
            weeklyMaxCount: limit.maxCountWeekly,
            monthlyMaxAmount: limit.maxAmountMonthly,
            monthlyMaxCount: limit.maxCountMonthly
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
            var range = splitRange[0];
            var cumulative = {
                splitNameId,
                currency: range.startAmountCurrency,
                dailyCount: range.startCountDaily,
                dailyAmount: range.startAmountDaily,
                weeklyCount: range.startCountWeekly,
                weeklyAmount: range.startAmountWeekly,
                monthlyCount: range.startCountMonthly,
                monthlyAmount: range.startAmountMonthly,
                ranges: []
            };
            splitRange.forEach((srange) => {
                cumulative.ranges.push({
                    splitRangeId: srange.splitRangeId,
                    startAmount: srange.startAmount,
                    minAmount: srange.minValue,
                    maxAmount: srange.maxValue,
                    percent: srange.percent,
                    isSourceAmount: srange.isSourceAmount
                });
            });
            split.cumulatives.push(cumulative);
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
            let cumulative = split.cumulatives && split.cumulatives[0];
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
            cumulative && !cumulative.currency && !isEmptyValuesOnly(cumulative) &&
            (errors = errors.setIn(['split', 'splits', idx, 'cumulatives', 0, 'currency'], errorMessage.currencyRequired));

            // ranges
            cumulative && cumulative.ranges && cumulative.ranges.forEach(function(range, ridx) {
                range && !isEmptyValuesOnly(range) && !range.startAmount &&
                    (errors = errors.setIn(['split', 'splits', idx, 'cumulatives', 0, 'ranges', ridx, 'startAmount'], errorMessage.startAmountRequired));
            });
        }
    });
    return errors.toJS();
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