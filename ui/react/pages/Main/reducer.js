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
    ['condition', 'limit', 'splitName'].forEach(function(prop) {
        if (data[prop].length) {
            data[prop].forEach(function(record) {
                if (!result[record.conditionId]) {
                    result[record.conditionId] = {};
                }
                if (!result[record.conditionId][prop]) {
                    result[record.conditionId][prop] = [];
                }
                if (record.splitNameId) {
                    splitNameConditionMap[record.splitNameId] = record.conditionId;
                }
                result[record.conditionId][prop].push(record);
            })
        }
    });
    ['splitRange', 'splitAssignment'].forEach(function(prop) {
        if (data[prop].length) {
            data[prop].forEach(function(record) {
                if (!result[splitNameConditionMap[record.splitNameId]][prop]) {
                    result[splitNameConditionMap[record.splitNameId]][prop] = [];
                }
                result[splitNameConditionMap[record.splitNameId]][prop].push(record);
            })
        }
    });
    debugger;
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