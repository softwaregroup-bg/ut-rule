import { errorMessage } from './validator';
import { defaultErrorState } from './Tabs/defaultState';
import { fromJS } from 'immutable';
import { prepareRuleModel as prepareRule } from '../../../../common';

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

export const formatNomenclatures = (items) => {
    const formattedPayload = {};
    // default object properties
    ['accountProduct', 'cardProduct', 'channel', 'city', 'country', 'operation', 'region', 'currency', 'organization', 'agentRole']
        .forEach((objName) => (formattedPayload[objName] = []));
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
    const { operation, channel, split, limit } = rule;
    const formattedRule = {};
    const conditionId = channel.conditionId;
    formattedRule.condition = [{
        conditionId,
        priority: channel.priority,
        operationStartDate: operation.startDate || null,
        operationEndDate: operation.endDate || null,
        sourceAccountId: null,
        destinationAccountId: null
    }];
    formattedRule.conditionActor = [];
    ['channel', 'source', 'destination'].forEach(function(keyProp) {
        const value = rule[keyProp];
        ['organization', 'role', 'agentRole'].forEach((type) => {
            if (value[type] && value[type] instanceof Array) {
                value[type].forEach(function(ci) {
                    ci.key && formattedRule.conditionActor.push({
                        actorId: ci.key,
                        conditionId,
                        factor: conditionActorFactor[keyProp]
                    });
                });
            } else {
                value[type] && formattedRule.conditionActor.push(
                    {
                        actorId: value[type],
                        conditionId,
                        factor: conditionActorFactor[keyProp]
                    }
                );
            }
        });
    });

    formattedRule.conditionItem = [];

    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        const tab = rule[tabKey];
        tab && ['accountProduct', 'cities', 'countries', 'regions', 'operations'].forEach(function(kepProp) {
            const value = tab[kepProp];
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

    const cardProducts = rule && rule.source && rule.source.cardProducts;
    if (cardProducts && cardProducts.length) {
        cardProducts.forEach(cp => {
            formattedRule.conditionItem.push({
                itemNameId: cp.key,
                conditionId,
                factor: factors.sourceCategory
            });
        });
    }

    formattedRule.conditionProperty = [];

    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        const tab = rule[tabKey];
        if (tab) {
            const value = tab.properties;
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
        const formattedSplit = {};
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
            const cum = {
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
    const rule = prepareRule(result) || {};
    const errState = fromJS(defaultErrorState).toJS();
    errState.split.splits = [];
    rule.split.splits.forEach((split, sidx) => {
        errState.split.splits.push({
            tags: [],
            assignments: Array(split.assignments.length).fill({}),
            cumulatives: split.cumulatives.map((cumulative) => ({
                ranges: Array((((cumulative || {}).ranges || [])).length).fill({})
            }))
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
    let errors = fromJS(existErrors || defaultErrorState);
    const { destination, source, operation, channel, split, limit } = rule;
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
        const isEmptySplit = isEmptyValuesOnly(split);
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
    let properties = [];
    ['channel', 'destination', 'source', 'operation'].forEach(function(tabKey) {
        const tab = rule[tabKey];
        if (tab) {
            const value = tab.properties;
            value && (properties = properties.concat(value));
        }
    });
    return properties;
};

export const isEmptyValuesOnly = (obj) => {
    let tempIsEmpty = true;
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
    const diffObj = {};
    for (const prop in obj1) {
        if (Object.prototype.hasOwnProperty.call(obj1, prop) && prop !== '__proto__') {
            if (!Object.prototype.hasOwnProperty.call(obj2, prop)) diffObj[prop] = obj1[prop];
            else if (obj1[prop] === Object(obj1[prop])) {
                const difference = diff(obj1[prop], obj2[prop]);
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
        for (const prop in x) {
            if (Object.prototype.hasOwnProperty.call(y, prop)) {
                if (!isEqual(x[prop], y[prop])) return false;
            } // else return false;
        }
        return true;
    } else if (String(x || null) !== String(y || null)) return false;
    else return true;
};

export const getRuleErrorCount = (errors) => {
    const flattenObj = flatten(errors);
    const errorCount = {};
    tabs.map((tab) => {
        errorCount[tab] = Object.keys(flattenObj).filter((fkey) => flattenObj[fkey] && fkey.startsWith(tab)).length;
    });
    return errorCount;
};

export const flatten = function(ob) {
    const result = {};
    for (const i in ob) {
        if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;
        if ((typeof ob[i]) === 'object') {
            const flatObject = flatten(ob[i]);
            for (const x in flatObject) {
                if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
                result[i + '.' + x] = flatObject[x];
            }
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};
