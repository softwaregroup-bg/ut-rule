import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    if (action.type === actionTypes.reset) {
        return defaultState;
    } else if (action.result) {
        switch (action.type) {
            case actionTypes.fetchNomenclatures:
                return Object.assign({}, state, {'fetchNomenclatures': formatNomenclatures(action.result.items)});
            case actionTypes.fetchRules:
                return Object.assign({}, state, {'fetchRules': formatRules(action.result)});
            default:
                break;
        }
    }
    return state;
};

const formatRules = function(data) {
    return Object.keys(data).reduce(function(all, key) {
        data[key].forEach(function(record) {
            if (!record) {
                return;
            }
            if (!all[record.conditionId]) {
                all[record.conditionId] = {};
            }
            if (!all[record.conditionId][key]) {
                all[record.conditionId][key] = [];
            }
            all[record.conditionId][key].push(record);
        });
        return all;
    }, {});
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
