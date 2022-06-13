import * as actionTypes from './actionTypes';
import map from 'lodash.map';
import { getLink } from 'ut-front-react/routerHelper';
import { fromJS } from 'immutable';

const defaultState = {
    showDeleted: false
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
                    fetchNomenclatures: formatNomenclatures(action.result.items)
                });
            case actionTypes.fetchRules: {
                const showDeleted = state.showDeleted;
                const formattedRules = (formatRules(action.result));
                map(formattedRules, (rule) => {
                    rule.url = showDeleted ? getLink('ut-history:deleted', {objectId: rule.condition[0].conditionId, objectName: 'rule'}) : getLink('ut-rule:edit', {id: rule.condition[0].conditionId});
                    return rule;
                });
                return Object.assign({}, state, {
                    fetchRules: formattedRules,
                    conditionActor: action.result.conditionActor,
                    conditionItem: action.result.conditionItem,
                    conditionProperty: action.result.conditionProperty,
                    formatedGridData: getFormattedGridDataColumns(action.result, formattedRules),
                    pagination: {...state.pagination, ...(action.result.pagination && action.result.pagination[0])},
                    showDeleted: showDeleted
                });
            }
            case actionTypes.lockUnlockRule:
                return state;
            default:
                break;
        }
    } else {
        switch (action.type) {
            case actionTypes.fetchRules:
                if (!action.params.pageSize && state.pagination) {
                    action.params = {...action.params, ...{pageSize: state.pagination.pageSize}};
                    return {...state, ...state.showDeleted};
                }
                break;
            case actionTypes.reset:
                return defaultState;
            case actionTypes.updatePagination: {
                let changeId = (state.pagination.changeId || 0);
                const paginationState = {pagination: {...action.params.toJS(), ...{changeId: ++changeId}}};

                return {...state, ...paginationState};
            }
            case actionTypes.toggleRuleOption: {
                const showState = {showDeleted: action.params.value};
                return {...state, ...showState};
            }
        }
    }
    return state;
};

const formatRules = function(data) {
    if (!data.condition.length) {
        return {};
    }
    const result = {};
    const splitNameConditionMap = {};
    ['condition', 'limit'].forEach(function(prop) {
        if (data[prop] && (data[prop].length)) {
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
    data.splitName && data.splitName.forEach(function(record) {
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
        let mappedData;
        if (data[prop] && data[prop].length) {
            data[prop].forEach(function(record) {
                mappedData = splitNameConditionMap[record.splitNameId];
                result[mappedData.conditionId].split[mappedData.index][prop].push(record);
            });
        }
    });
    for (const resultKey in result) {
        for (const splitKey in result[resultKey].split) {
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

const getFormattedGridDataColumns = function(fetchedData, formattedRules) {
    // the pattern is:
    // result = {
    //     conditionId: {
    //         factorId: [{
    //              name: '...', value: '...'
    //         }]
    //     }
    // };
    fromJS(formattedRules).toJS();
    const result = {};
    fetchedData.conditionItem && fetchedData.conditionItem.forEach((item) => {
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
    fetchedData.conditionProperty && fetchedData.conditionProperty.forEach((property) => {
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

    fetchedData.conditionActor && fetchedData.conditionActor.forEach((actor) => {
        if (!result[actor.conditionId]) {
            result[actor.conditionId] = {};
        }
        if (!result[actor.conditionId][actor.factor]) {
            result[actor.conditionId][actor.factor] = [];
        }

        result[actor.conditionId][actor.factor].push({
            name: actor.type,
            value: actor.type === 'organization' ? actor.organizationName : actor.actorId
        });
    });
    Object.keys(formattedRules).forEach((conditionId) => {
        const limitArray = formattedRules[conditionId].limit;
        const splitArray = formattedRules[conditionId].split;
        if (!result[conditionId]) {
            result[conditionId] = {};
        }
        if (limitArray && limitArray.length) {
            limitArray.forEach((limit) => {
                if (!result[conditionId].limit) {
                    result[conditionId].limit = [];
                }
                if (limit.currency) {
                    result[conditionId].limit.push({
                        name: 'Currency',
                        value: limit.currency
                    });
                }
                if (limit.maxAmount && limit.minAmount) {
                    result[conditionId].limit.push({
                        name: 'Transaction',
                        value: (limit.maxAmount ? 'max ' + limit.maxAmount + ' ' : '') + (limit.minAmount ? 'min ' + limit.minAmount + ' ' : '')
                    });
                }
                if (limit.maxAmountDaily && limit.maxCountDaily) {
                    result[conditionId].limit.push({
                        name: 'Daily',
                        value: (limit.maxAmountDaily ? 'max ' + limit.maxAmountDaily + ' ' : '') + (limit.maxCountDaily ? 'count ' + limit.maxCountDaily + ' ' : '')
                    });
                }
                if (limit.maxAmountWeekly && limit.maxCountWeekly) {
                    result[conditionId].limit.push({
                        name: 'Weekly',
                        value: (limit.maxAmountWeekly ? 'max ' + limit.maxAmountWeekly + ' ' : '') + (limit.maxCountWeekly ? 'count ' + limit.maxCountWeekly + ' ' : '')
                    });
                }
                if (limit.maxAmountMonthly && limit.maxCountMonthly) {
                    result[conditionId].limit.push({
                        name: 'Monthly',
                        value: (limit.maxAmountMonthly ? 'max ' + limit.maxAmountMonthly + ' ' : '') + (limit.maxCountMonthly ? 'count ' + limit.maxCountMonthly + ' ' : '')
                    });
                }
            });
        }
        if (splitArray && splitArray.length) {
            splitArray.forEach((split) => {
                if (!result[conditionId].split) {
                    result[conditionId].split = [];
                }
                if (split.splitName && split.splitName.name) {
                    result[conditionId].split.push({
                        name: 'Name',
                        value: split.splitName.name
                    }, {
                        separator: true
                    });
                }
                if (split.splitRange && split.splitRange.length) {
                    split.splitRange.forEach((range) => {
                        if (range.startAmountCurrency) {
                            result[conditionId].split.push({
                                name: 'Currency',
                                value: range.startAmountCurrency
                            });
                        }
                        if (range.startAmountDaily) {
                            result[conditionId].split.push({
                                renderOnlyValue: true,
                                boldValue: true,
                                value: `Daily Count <= ${range.startAmountDaily}`
                            });
                        }
                        if (range.startAmount) {
                            const name = `${getPaddedStringWithSpaces(`Amount >= ${range.startAmount}`, amountCharacters)}`.split('');
                            const value = `${getPaddedStringWithSpaces(range.percent ? `${range.percent}%;` : '', maxPercentageCharacters)} ${getPaddedStringWithSpaces(range.minValue ? `min: ${range.minValue};` : '', minAmountCharacters)} ${getPaddedStringWithSpaces(range.maxValue ? `max: ${range.maxValue};` : '', maxAmountCharacters)} ${getPaddedStringWithSpaces(range.percentBase ? `base: ${range.percentBase};` : '', basePercentageCharacters)}`.trim().split('');
                            result[conditionId].split.push({
                                name: name,
                                value: value
                            });
                        }
                        result[conditionId].split.push({
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
        const whitespace = ' ';
        return str + whitespace.repeat(maxStringLength - str.length);
    }
    return str;
};
