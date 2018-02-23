import { fromJS } from 'immutable';

import * as actionTypes from './actionTypes';
import { RESET_RULE_STATE } from '../../../../pages/RuleProfile/actionTypes';

const defaultState = fromJS({
    fields: {
        countries: [],
        regions: [],
        cities: [],
        organization: '',
        product: '',
        properties: []
    }
});

export const ruleSourceTabReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_MULTISELECT_FIELD:
            return state.setIn(['fields', action.params.field], fromJS(action.params.newValue));
        case actionTypes.CHANGE_DROPDOWN_FIELD:
            return state.setIn(['fields', action.params.field], action.params.newValue);
        case actionTypes.ADD_PROPERTY:
            return state.updateIn(['fields', 'properties'], v => v.push(fromJS({
                name: '',
                value: ''
            })));
        case actionTypes.REMOVE_PROPERTY:
            return state.updateIn(['fields', 'properties'], v => v.splice(action.params.propertyId, 1));
        case actionTypes.SET_PROPERTY_FIELD:
            return state.setIn(
                ['fields', 'properties', action.params.propertyId, action.params.field],
                action.params.newValue
            );
        case RESET_RULE_STATE:
            return defaultState;
        default:
            return state;
    }
};
