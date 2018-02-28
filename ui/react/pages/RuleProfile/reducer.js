import { fromJS } from 'immutable';
import { methodRequestState } from 'ut-front-react/constants';
import { formatNomenclatures, prepareRuleModel } from './helpers';
import { defaultTabState, emptyLimit, emptySplit, emptyAssignment, emptyRange } from './Tabs/defaultState';
import * as actionTypes from './actionTypes';
const __placeholder__ = '__placeholder__';
const defaultState = {
    nomenclatures: {
        accountProduct: [],
        cardProduct: [],
        channel: [],
        city: [],
        country: [],
        operation: [],
        region: [],
        currency: [],
        organization: []
    },
    config: {
        nomenclaturesFetched: false,
        ruleSaved: false,
        mode: null,
        id: null
    },
    rules: {}
};

export const ruleProfileReducer = (state = fromJS(defaultState), action) => {
    let { mode, id } = state.get('config').toJS();
    switch (action.type) {
        case actionTypes.CHANGE_RULE_PROFILE:
            if (action.params.mode && action.params.id) {
                return state.setIn(['config', 'mode'], action.params.mode)
                    .setIn(['config', 'id'], action.params.id)
                    .setIn([action.params.mode, action.params.id], state.getIn([action.params.mode, action.params.id]) || fromJS(defaultTabState));
            }
            return state;
        case actionTypes.FETCH_NOMENCLATURES:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.set('nomenclatures', fromJS(formatNomenclatures(action.result.items)))
                    .setIn(['config', 'nomenclaturesFetched'], true);
            }
            return state;
        case actionTypes.EDIT_RULE:
        case actionTypes.CREATE_RULE:
            if (action.methodRequestState === methodRequestState.FINISHED && !action.error) {
                return state.setIn(['config', 'ruleSaved'], true);
            }
            return state;
        case actionTypes.GET_RULE:
            if (action.methodRequestState === methodRequestState.FINISHED && !action.error) {
                return state.setIn([mode, id], fromJS(prepareRuleModel(action.result)))
                    .setIn(['rules', id], action.result);
            }
            return state;
        case actionTypes.RESET_RULE_STATE:
            if (mode === 'create') {
                return state.setIn(['config', 'ruleSaved'], false).setIn([mode, id], fromJS(defaultTabState));
            } else {
                return state.setIn(['config', 'ruleSaved'], false);
            }
        // tab common actions
        case actionTypes.CHANGE_MULTISELECT_FIELD:
            if (action.params.newValue === __placeholder__) action.params.newValue = null;
            return state.setIn([mode, id, action.destinationProp, action.params.field], fromJS(action.params.newValue));
        case actionTypes.CHANGE_DROPDOWN_FIELD:
            if (action.params.newValue === __placeholder__) action.params.newValue = null;
            return state.setIn([mode, id, action.destinationProp, action.params.field], action.params.newValue);
        case actionTypes.ADD_PROPERTY:
            return state.updateIn([mode, id, action.destinationProp, 'properties'], v => v.push(fromJS({
                name: '',
                value: ''
            })));
        case actionTypes.REMOVE_PROPERTY:
            return state.updateIn([mode, id, action.destinationProp, 'properties'], v => v.splice(action.params.propertyId, 1));
        case actionTypes.SET_PROPERTY_FIELD:
            return state.setIn(
                [mode, id, action.destinationProp, 'properties', action.params.propertyId, action.params.field],
                action.params.newValue
            );
        // limit actions
        case actionTypes.ADD_LIMIT:
            return state.updateIn([mode, id, 'limit'], v => v.push(fromJS(emptyLimit)));
        case actionTypes.REMOVE_LIMIT:
            return state.updateIn([mode, id, 'limit'], v => v.splice(action.params.limitId, 1));
        case actionTypes.SET_LIMIT_FIELD:
            return state.setIn(
                [mode, id, 'limit', action.params.limitId, action.params.field],
                action.params.newValue
            );
        // split actions
        case actionTypes.CHANGE_SPLIT_MULTISELECT_FIELD:
            if (action.params.newValue === __placeholder__) action.params.newValue = null;
            return state.setIn([mode, id, 'split', 'splits', action.params.splitIndex, action.params.field], fromJS(action.params.newValue));
        case actionTypes.CHANGE_SPLIT_DROPDOWN_FIELD:
            if (action.params.newValue === __placeholder__) action.params.newValue = null;
            return state.setIn([mode, id, 'split', 'splits', action.params.splitIndex, action.params.field], action.params.newValue);
        case actionTypes.CHANGE_SPLIT_INPUT_FIELD:
            return state.setIn([mode, id, 'split', 'splits', action.params.splitIndex, action.params.field], action.params.newValue);
        case actionTypes.ADD_ASSIGNMENT:
            return state.updateIn([mode, id, 'split', 'splits', action.params.splitIndex, 'assignments'], v => v.push(fromJS(emptyAssignment)));
        case actionTypes.REMOVE_ASSIGNMENT:
            return state.updateIn([mode, id, 'split', 'splits', action.params.splitIndex, 'assignments'], v => v.splice(action.params.propertyId, 1));
        case actionTypes.SET_ASSIGNMENT_FIELD:
            return state.setIn(
                [mode, id, 'split', 'splits', action.params.splitIndex, 'assignments', action.params.propertyId, action.params.field],
                action.params.newValue
            );
        case actionTypes.SET_CUMULATIVE_FIELD:
            return state.setIn(
                [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, action.params.field],
                action.params.newValue
            );
        case actionTypes.ADD_CUMULATIVE_RANGE:
            return state.updateIn(
                [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
                v => v.push(fromJS(emptyRange)));
        case actionTypes.REMOVE_CUMULATIVE_RANGE:
            return state.updateIn(
                [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
                v => v.splice(action.params.rangeId, 1));
        case actionTypes.SET_CUMULATIVE_RANGE_FIELD:
            return state.setIn(
                [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges', action.params.rangeId, action.params.field],
                action.params.newValue
            );
        case actionTypes.ADD_SPLIT:
            return state.updateIn(
                [mode, id, 'split', 'splits'],
                v => v.push(fromJS(emptySplit)));
        case actionTypes.REMOVE_SPLIT:
            return state.updateIn(
                [mode, id, 'split', 'splits'],
                v => v.splice(action.params.splitIndex, 1));
        default:
            return state;
    }
};
