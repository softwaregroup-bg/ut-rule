import { Map, List } from 'immutable';

import * as actionTypes from './actionTypes';
import { RESET_RULE_STATE } from '../../../../pages/RuleProfile/actionTypes';

const defaultState = Map({
    fields: Map({
        priority: '',
        countries: List([]),
        regions: List([]),
        cities: List([]),
        organization: '',
        properties: List([])
    })
});

export const CHANGE_MULTISELECT_FIELD = Symbol('CHANGE_MULTISELECT_FIELD');
export const CHANGE_DROPDOWN_FIELD = Symbol('CHANGE_DROPDOWN_FIELD');
export const ADD_PROPERTY = Symbol('ADD_PROPERTY');
export const REMOVE_PROPERTY = Symbol('REMOVE_PROPERTY');
export const SET_PROPERTY_FIELD = Symbol('SET_PROPERTY_FIELD');

export const ruleChannelTabReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_MULTISELECT_FIELD:
            return state.setIn(['fields', action.params.field], List(action.params.newValue));
        case actionTypes.CHANGE_DROPDOWN_FIELD:
            return state.setIn(['fields', action.params.field], action.params.newValue);
        case actionTypes.ADD_PROPERTY:
            return state.updateIn(['fields', 'properties'], v => v.push(Map({
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
