import { REMOVE_TAB } from 'ut-front-react/containers/TabMenu/actionTypes';

import * as actionTypes from './actionTypes';

const defaultState = {
    filterData: {
        operationIds: [],
        priority: {
            from: {
                value: null,
                isValid: true
            },
            to: {
                value: null,
                isValid: true
            }
        },
        errorMessage: 'Enter numerical values'
    }
};

const maxPercentageCharacters = 5;
const amountCharacters = 14;
const minAmountCharacters = 10;
const maxAmountCharacters = 10;
const basePercentageCharacters = 10;

export default (state = defaultState, action) => {
    if (action.result && action.methodRequestState === 'finished') {
        switch (action.type) {
            case actionTypes.fetchNomenclatures:
                return Object.assign({}, state, {
                    'fetchNomenclatures': formatNomenclatures(action.result.items)
                });
            case actionTypes.fetchRules:
                let formattedRules = formatRules(action.result);

                return Object.assign({}, state, {
                    'fetchRules': formattedRules,
                    'conditionActor': action.result.conditionActor,
                    'conditionItem': action.result.conditionItem,
                    'conditionProperty': action.result.conditionProperty,
                    'formatedGridData': getFormattedGridDataColumns(action.result, formattedRules, state.fetchNomenclatures),
                    'pagination': {...state.pagination, ...(action.result.pagination && action.result.pagination[0])}
                });
            default:
                break;
        }
    } else {
        switch (action.type) {
            case actionTypes.fetchRules:
                if (!action.params.pageSize && state.pagination) {
                    action.params = {...action.params, ...{pageSize: state.pagination.pageSize}};
                }
                break;
            case actionTypes.reset:
                return defaultState;
            case actionTypes.updatePagination:
                let changeId = (state.pagination.changeId || 0);
                let paginationState = {pagination: {...action.params.toJS(), ...{changeId: ++changeId}}};

                return {...state, ...paginationState};
            case actionTypes.CHANGE_FILTER_FIELD:
                return Object.assign({}, state, {
                    'filterData': action.params.filterData
                });
            case REMOVE_TAB:
                if (action.pathname === '/rule') {
                    return Object.assign({}, state, {
                        'filterData': {
                            operationIds: [],
                            priority: {
                                from: {
                                    value: null,
                                    isValid: true
                                },
                                to: {
                                    value: null,
                                    isValid: true
                                }
                            },
                            errorMessage: 'Enter numerical values'
                            }
                        });
                    }
                }
    }

    return state;
};

var formatRules = function(data) {
    if (!data.condition.length) {
        return {};
    }
    var result = {};
    var splitNameConditionMap = {};
    ['condition', 'limit'].forEach(function(prop) {
        if (data[prop].length) {
            data[prop].forEach(function(record) {
                if (!result[record.conditionId]) {
                    result[record.conditionId] = {};
                }
                if (!result[record.conditionId][prop]) {
                    result[record.conditionId][prop] = [];
                }
                result[record.conditionId][prop].push(record);
            });
        }
    });
    data.splitName.forEach(function(record) {
        if (!result[record.conditionId].split) {
            result[record.conditionId].split = [];
        }
        splitNameConditionMap[record.splitNameId] = {
            index: result[record.conditionId].split.length,
            conditionId: record.conditionId
        };
        result[record.conditionId].split.push({
            splitName: record,
            splitAssignment: [],
            splitRange: []
        });
    });
    ['splitRange', 'splitAssignment'].forEach(function(prop) {
        var mappedData;
        if (data[prop].length) {
            data[prop].forEach(function(record) {
                mappedData = splitNameConditionMap[record.splitNameId];
                result[mappedData.conditionId].split[mappedData.index][prop].push(record);
            });
        }
    });
    for (var resultKey in result) {
        for (var splitKey in result[resultKey].split) {
            if (result[resultKey].split[splitKey].splitName.tag !== null) {
                result[resultKey].split[splitKey].splitName.tag = result[resultKey].split[splitKey].splitName.tag.split('|').filter((v) => (v !== '')).map((v) => ({key: v, name: v}));
            }
        }
    }
    return result;
};

const formatNomenclatures = function(data) {
    return data.reduce(function(all, record) {
        if (!all[record.type]) {
            all[record.type] = {};
        }
        all[record.type][record.value] = record.display;

        return all;
    }, {});
};

const getFormattedGridDataColumns = function(fetchedData, formattedRules, nomenclatures) {
    // the pattern is:
    // result = {
    //     conditionId: {
    //         factorId: [{
    //              name: '...', value: '...'
    //         }]
    //     }
    // };
    let result = {};
    let hasValue = (value) => {
        return value !== null && value !== undefined;
    };
    fetchedData.conditionItem.forEach((item) => {
        if (!result[item.conditionId]) {
            result[item.conditionId] = {};
        }
        if (!result[item.conditionId][item.factor]) {
            result[item.conditionId][item.factor] = [];
        }
        result[item.conditionId][item.factor].push({
            name: item.itemTypeName,
            value: item.itemName
        });
    });
    fetchedData.conditionProperty.forEach((property) => {
        if (!result[property.conditionId]) {
            result[property.conditionId] = {};
        }
        if (!result[property.conditionId][property.factor]) {
            result[property.conditionId][property.factor] = [];
        }

        result[property.conditionId][property.factor].push({
            name: property.name,
            value: property.value
        });
    });

    fetchedData.conditionActor.forEach((actor) => {
        if (!result[actor.conditionId]) {
            result[actor.conditionId] = {};
        }
        if (!result[actor.conditionId][actor.factor]) {
            result[actor.conditionId][actor.factor] = [];
        }

        if (actor.type === 'role' && nomenclatures && nomenclatures.agentType && nomenclatures.agentType[actor.actorId]) {
            actor.type = 'agentType';
        }

        if (actor.type === 'organization' && nomenclatures && nomenclatures.organization && nomenclatures.organization[actor.actorId]) {
            actor.displayName = nomenclatures.organization[actor.actorId];
        }

        result[actor.conditionId][actor.factor].push({
            name: actor.type,
            value: actor.actorId,
            translatedValue: actor.roleName || actor.displayName
        });
    });
    Object.keys(formattedRules).forEach((conditionId) => {
        let limitArray = formattedRules[conditionId].limit;
        let splitArray = formattedRules[conditionId].split;
        if (!result[conditionId]) {
            result[conditionId] = {};
        }
        if (limitArray && limitArray.length) {
            limitArray.forEach((limit) => {
                if (!result[conditionId]['limit']) {
                    result[conditionId]['limit'] = [];
                }
                if (limit.currency) {
                    result[conditionId]['limit'].push({
                        name: 'Currency',
                        value: limit.currency
                    });
                }
                if (hasValue(limit.maxAmount) || hasValue(limit.minAmount)) {
                    result[conditionId]['limit'].push({
                        name: 'Transaction',
                        value: ( hasValue(limit.maxAmount) ? 'max ' + limit.maxAmount + ' ' : '') + (hasValue(limit.minAmount) ? 'min ' + limit.minAmount + ' ' : '')
                    });
                }
                if (hasValue(limit.maxAmountDaily) || hasValue(limit.maxCountDaily)) {
                    result[conditionId]['limit'].push({
                        name: 'Daily',
                        value: (hasValue(limit.maxAmountDaily) ? 'max ' + limit.maxAmountDaily + ' ' : '') + (hasValue(limit.maxCountDaily) ? 'count ' + limit.maxCountDaily + ' ' : '')
                    });
                }
                if (hasValue(limit.maxAmountWeekly) || hasValue(limit.maxCountWeekly)) {
                    result[conditionId]['limit'].push({
                        name: 'Weekly',
                        value: (hasValue(limit.maxAmountWeekly) ? 'max ' + limit.maxAmountWeekly + ' ' : '') + (hasValue(limit.maxCountWeekly) ? 'count ' + limit.maxCountWeekly + ' ' : '')
                    });
                }
                if (hasValue(limit.maxAmountMonthly) || hasValue(limit.maxCountMonthly)) {
                    result[conditionId]['limit'].push({
                        name: 'Monthly',
                        value: (hasValue(limit.maxAmountMonthly) ? 'max ' + limit.maxAmountMonthly + ' ' : '') + (hasValue(limit.maxCountMonthly) ? 'count ' + limit.maxCountMonthly + ' ' : '')
                    });
                }
            });
        }
        if (splitArray && splitArray.length) {
            splitArray.forEach((split) => {
                if (!result[conditionId]['split']) {
                    result[conditionId]['split'] = [];
                }
                if (split.splitName && split.splitName.name) {
                    result[conditionId]['split'].push({
                        name: 'Name',
                        value: split.splitName.name
                    }, {
                        separator: true
                    });
                }
                if (split.splitRange && split.splitRange.length) {
                    split.splitRange.forEach((range) => {
                        if (range.startAmountCurrency) {
                            result[conditionId]['split'].push({
                                name: 'Currency',
                                value: range.startAmountCurrency
                            });
                        }
                        if (range.startAmountDaily) {
                            result[conditionId]['split'].push({
                                renderOnlyValue: true,
                                boldValue: true,
                                value: `Daily Count <= ${range.startAmountDaily}`
                            });
                        }
                        if (range.startAmount) {
                            let name = `${getPaddedStringWithSpaces(`Amount >= ${range.startAmount}`, amountCharacters)}`.split('');
                            let value = `${getPaddedStringWithSpaces(range.percent ? `${range.percent}%;` : '', maxPercentageCharacters)} ${getPaddedStringWithSpaces(range.minValue ? `min: ${range.minValue};` : '', minAmountCharacters)} ${getPaddedStringWithSpaces(range.maxValue ? `max: ${range.maxValue};` : '', maxAmountCharacters)} ${getPaddedStringWithSpaces(range.percentBase ? `base: ${range.percentBase};` : '', basePercentageCharacters)}`.trim().split('');
                            result[conditionId]['split'].push({
                                name: name,
                                value: value
                            });
                        }
                        result[conditionId]['split'].push({
                            setEmptyRow: true
                        });
                    });
                }
            });
        }
    });
    return result;
};

const getPaddedStringWithSpaces = function(str, maxStringLength) {
    if (maxStringLength > str.length) {
        let whitespace = ' ';
        return str + whitespace.repeat(maxStringLength - str.length);
    }
    return str;
};
