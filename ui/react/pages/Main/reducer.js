import * as actionTypes from './actionTypes';
const defaultState = {};

export default (state = defaultState, action) => {
    if (action.type === actionTypes.reset) {
        return defaultState;
    } else if (action.result && action.methodRequestState === 'finished') {
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
                    'formatedGridData': getFormattedGridDataColumns(action.result, formattedRules)
                });
            default:
                break;
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

const getFormattedGridDataColumns = function(fetchedData, formattedRules) {
    // the pattern is:
    // result = {
    //     conditionId: {
    //         factorId: [{
    //              name: '...', value: '...'
    //         }]
    //     }
    // };
    let result = {};
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

        result[actor.conditionId][actor.factor].push({
            name: actor.type,
            value: actor.actorId
        });
    });
    Object.keys(formattedRules).forEach((conditionId) => {
        let limitArray = formattedRules[conditionId].limit;
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
                if (limit.maxAmount && limit.minAmount) {
                    result[conditionId]['limit'].push({
                        name: 'Transaction',
                        value: (limit.maxAmount ? 'max ' + limit.maxAmount + ' ' : '') + (limit.minAmount ? 'min ' + limit.minAmount + ' ' : '')
                    });
                }
                if (limit.maxAmountDaily && limit.maxCountDaily) {
                    result[conditionId]['limit'].push({
                        name: 'Daily',
                        value: (limit.maxAmountDaily ? 'max ' + limit.maxAmountDaily + ' ' : '') + (limit.maxCountDaily ? 'count ' + limit.maxCountDaily + ' ' : '')
                    });
                }
                if (limit.maxAmountWeekly && limit.maxCountWeekly) {
                    result[conditionId]['limit'].push({
                        name: 'Weekly',
                        value: (limit.maxAmountWeekly ? 'max ' + limit.maxAmountWeekly + ' ' : '') + (limit.maxCountWeekly ? 'count ' + limit.maxCountWeekly + ' ' : '')
                    });
                }
                if (limit.maxAmountMonthly && limit.maxCountMonthly) {
                    result[conditionId]['limit'].push({
                        name: 'Monthly',
                        value: (limit.maxAmountMonthly ? 'max ' + limit.maxAmountMonthly + ' ' : '') + (limit.maxCountMonthly ? 'count ' + limit.maxCountMonthly + ' ' : '')
                    });
                }
            });
        }
    });
    return result;
};
