import immutable, { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';
import * as reducerHelper from './reducerHelper';
import { REMOVE_TAB } from 'ut-front-react/containers/TabMenu/actionTypes';
import { removeRules as DELETE_RULE } from '../Rules/actionTypes';

export const localDataObj = {
    condition: {},
    conditionActor: [],
    conditionProperty: [],
    conditionItem: [],
    limit: [],
    splitName: [],
    splitAssignment: [],
    splitAnalytic: [],
    splitRange: []
};

export const confirmDialogObj = {
    isOpen: false,
    title: '',
    value: '',
    message: '',
    showInput: false,
    buttons: [],
    canSubmit: true
};

export const defaultState = {
    nomenclatures: {
        accountProduct: [],
        cardProduct: [],
        channel: [],
        city: [],
        country: [],
        operation: [],
        region: [],
        currency: [],
        organization: [],
        agentRole: []
    },
    config: {
        nomenclaturesFetched: false,
        ruleSaved: false,
        mode: null,
        id: null
    },
    rules: {},
    remoteData: {},
    localData: localDataObj,
    errors: fromJS({}),
    common: {
        confirmDialog: confirmDialogObj
    }
};

export const ruleProfileReducer = (state = fromJS(defaultState), action) => {
    const options = state.get('config').toJS();
    switch (action.type) {
        case actionTypes.CLOSE_CONFIRM_DIALOG:
            return reducerHelper.closeConfirmDialog(state, action, options);
        case actionTypes.UPDATE_USER_ERRORS:
            return reducerHelper.updateRuleErrors(state, action, options);
        case actionTypes.CHANGE_CONFIRM_DIALOG_VALUE:
            return reducerHelper.changeConfirmDialogValue(state, action, options);
        case actionTypes.OPEN_CONFIRM_DIALOG:
            return reducerHelper.openConfirmDialog(state, action, options);
        case actionTypes.SET_ACTIVE_TAB:
            return state.set('activeTab', immutable.fromJS(action.params));
        case actionTypes.GET_SINGLE_RULE:
            return reducerHelper.getSingleRule(state, action, options);
        case actionTypes.CHANGE_RULE_PROFILE:
            return reducerHelper.changeRuleProfile(state, action, options);
        case actionTypes.FETCH_NOMENCLATURES:
            return reducerHelper.fetchNomenclatures(state, action, options);
        case actionTypes.EDIT_RULE:
        case actionTypes.CREATE_RULE:
            return reducerHelper.saveRule(state, action, options);
        case actionTypes.APPROVE_RULE:
            return state;
        case actionTypes.GET_RULE:
        case actionTypes.REJECT_RULE:
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
        case actionTypes.ADD_CUMULATIVE:
            return reducerHelper.addCumulative(state, action, options);
        case actionTypes.REMOVE_CUMULATIVE:
            return reducerHelper.removeCumulative(state, action, options);
        case REMOVE_TAB:
            return reducerHelper.removeTab(state, action, options);
        case DELETE_RULE:
            return reducerHelper.deleteRule(state, action, options);
        default:
            return state;
    }
};
