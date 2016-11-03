import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.fetchNomenclatures:
            return action.result ? Object.assign({}, state, {'fetchNomenclatures': formatNomenclatures(action.result)}) : state;
        case actionTypes.fetchRules:
            return action.result ? Object.assign({}, state, {'fetchRules': formatRules(action.result)}) : state;
        case actionTypes.editRule:
            return action.result ? Object.assign({}, state, {'fetchRules': null}) : state;
        case actionTypes.addRule:
            return action.result ? Object.assign({}, state, {'fetchRules': null}) : state;
        case actionTypes.removeRules:
            return action.result ? Object.assign({}, state, {'fetchRules': null}) : state;
        case actionTypes.reset:
            return defaultState;
        default:
            return state;
    }
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
