import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';
import * as reducerHelper from './reducerHelper';
import { REMOVE_TAB } from 'ut-front-react/containers/TabMenu/actionTypes';

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
    let options = state.get('config').toJS();
    switch (action.type) {
        case actionTypes.CHANGE_RULE_PROFILE:
            return reducerHelper.changeRuleProfile(state, action, options);
        case actionTypes.FETCH_NOMENCLATURES:
            return reducerHelper.fetchNomenclatures(state, action, options);
        case actionTypes.EDIT_RULE:
        case actionTypes.CREATE_RULE:
            return reducerHelper.saveRule(state, action, options);
        case actionTypes.GET_RULE:
            return reducerHelper.getRule(state, action, options);
        case actionTypes.RESET_RULE_STATE:
            return reducerHelper.resetRuleProfile(state, action, options);
        case actionTypes.CHANGE_ACTIVE_TAB:
            return reducerHelper.changeActiveTab(state, action, options);
        // update errors
        case actionTypes.UPDATE_RULE_ERRORS:
            return reducerHelper.updateRuleErrors(state, action, options);
        // tab common actions
        case actionTypes.CHANGE_INPUT:
            return reducerHelper.changeInput(state, action, options);
        case actionTypes.ADD_PROPERTY:
            return reducerHelper.addProperty(state, action, options);
        case actionTypes.REMOVE_PROPERTY:
            return reducerHelper.removeProperty(state, action, options);

        // limit actions
        case actionTypes.ADD_LIMIT:
            return reducerHelper.addLimit(state, action, options);
        case actionTypes.REMOVE_LIMIT:
            return reducerHelper.removeLimit(state, action, options);

        // split actions
        case actionTypes.ADD_ASSIGNMENT:
            return reducerHelper.addAssignment(state, action, options);
        case actionTypes.REMOVE_ASSIGNMENT:
            return reducerHelper.removeAssignment(state, action, options);
        case actionTypes.ADD_CUMULATIVE_RANGE:
            return reducerHelper.addCumulativeRange(state, action, options);
        case actionTypes.REMOVE_CUMULATIVE_RANGE:
            return reducerHelper.removeCumulativeRange(state, action, options);
        case actionTypes.ADD_SPLIT:
            return reducerHelper.addSplit(state, action, options);
        case actionTypes.REMOVE_SPLIT:
            return reducerHelper.removeSplit(state, action, options);
        case REMOVE_TAB:
            return reducerHelper.removeTab(state, action, options);
        default:
            return state;
    }
};
