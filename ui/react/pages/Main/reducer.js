import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    if (action.type === actionTypes.reset) {
        return defaultState;
    } else if (action.result) {
        switch (action.type) {
            case actionTypes.fetchNomenclatures:
                return Object.assign({}, state, {
                    'fetchNomenclatures': formatNomenclatures(action.result.items)
                });
            case actionTypes.fetchRules:
                return Object.assign({}, state, {
                    'fetchRules': formatRules(action.result)
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
            result[resultKey].split[splitKey].splitName.tag = result[resultKey].split[splitKey].splitName.tag.split('|').filter((v) => (v !== '')).map((v) => ({key: v, name: v}));
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
