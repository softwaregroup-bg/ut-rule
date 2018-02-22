import { Map, List } from 'immutable';

import * as actionTypes from './actionTypes';
import { RESET_RULE_STATE } from '../../../../pages/RuleProfile/actionTypes';

const defaultState = Map({
    fields: Map({
        limits: List([])
    })
});

let emptyLimit = Map({
    currency: '',
    txMin: '',
    txMax: '',
    dailyMaxAmount: '',
    dailyMaxCount: '',
    weeklyMaxAmount: '',
    weeklyMaxCount: '',
    monthlyMaxAmount: '',
    monthlyMaxCount: ''
});

export const ruleLimitTabReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_DROPDOWN_FIELD:
            return state.setIn(
                ['fields', 'limits', action.params.limitId, action.params.field],
                action.params.newValue
            );
        case actionTypes.CHANGE_INPUT_FIELD:
            return state.setIn(['fields', action.params.field], action.params.newValue);
        case actionTypes.ADD_LIMIT:
            return state.updateIn(['fields', 'limits'], v => v.push(emptyLimit));
        case actionTypes.REMOVE_LIMIT:
            return state.updateIn(['fields', 'limits'], v => v.splice(action.params.limitId, 1));
        case actionTypes.SET_LIMIT_FIELD:
            return state.setIn(
                ['fields', 'limits', action.params.limitId, action.params.field],
                action.params.newValue
            );
        case RESET_RULE_STATE:
            return defaultState;
        default:
            return state;
    }
};
