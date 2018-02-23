import { fromJS } from 'immutable';

import * as actionTypes from './actionTypes';
import { RESET_RULE_STATE } from '../../../../pages/RuleProfile/actionTypes';

let emptyCumulative = {
    currency: '',
    dailyCount: '',
    dailyAmount: '',
    weeklyCount: '',
    weeklyAmount: '',
    monthlyCount: '',
    monthlyAmount: '',
    ranges: []
};
let emptySplit = {
    name: '',
    tags: [],
    cumulatives: [emptyCumulative],
    assignments: []
};
let emptyAssignment = {
    description: '',
    debit: '',
    credit: '',
    percent: '',
    minAmount: '',
    maxAmount: ''
};
let emptyRange = {
    startAmount: '',
    percent: '',
    minAmount: '',
    maxAmount: ''
};
const defaultState = fromJS({
    fields: {
        splits: [
            {
                name: '',
                tags: [],
                cumulatives: [emptyCumulative],
                assignments: []
            }
        ]
    }
});

export const ruleSplitTabReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_MULTISELECT_FIELD:
            return state.setIn(['fields', 'splits', action.params.splitIndex, action.params.field], fromJS(action.params.newValue));
        case actionTypes.CHANGE_DROPDOWN_FIELD:
            return state.setIn(['fields', 'splits', action.params.splitIndex, action.params.field], action.params.newValue);
        case actionTypes.CHANGE_INPUT_FIELD:
            return state.setIn(['fields', 'splits', action.params.splitIndex, action.params.field], action.params.newValue);
        case actionTypes.ADD_ASSIGNMENT:
            return state.updateIn(['fields', 'splits', action.params.splitIndex, 'assignments'], v => v.push(fromJS(emptyAssignment)));
        case actionTypes.REMOVE_ASSIGNMENT:
            return state.updateIn(['fields', 'splits', action.params.splitIndex, 'assignments'], v => v.splice(action.params.propertyId, 1));
        case actionTypes.SET_ASSIGNMENT_FIELD:
            return state.setIn(
                ['fields', 'splits', action.params.splitIndex, 'assignments', action.params.propertyId, action.params.field],
                action.params.newValue
            );
        case actionTypes.SET_CUMULATIVE_FIELD:
            return state.setIn(
                ['fields', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, action.params.field],
                action.params.newValue
            );
        case actionTypes.ADD_CUMULATIVE_RANGE:
            return state.updateIn(
                ['fields', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
                v => v.push(fromJS(emptyRange)));
        case actionTypes.REMOVE_CUMULATIVE_RANGE:
            return state.updateIn(
                ['fields', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
                v => v.splice(action.params.rangeId, 1));
        case actionTypes.SET_CUMULATIVE_RANGE_FIELD:
            return state.setIn(
                ['fields', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges', action.params.rangeId, action.params.field],
                action.params.newValue
            );
        case actionTypes.ADD_SPLIT:
            return state.updateIn(
                ['fields', 'splits'],
                v => v.push(fromJS(emptySplit)));
        case actionTypes.REMOVE_SPLIT:
            return state.updateIn(
                ['fields', 'splits'],
                v => v.splice(action.params.splitIndex, 1));
        case RESET_RULE_STATE:
            return defaultState;
        default:
            return state;
    }
};
