import { Map, List } from 'immutable';
import { methodRequestState } from 'ut-front-react/constants';

import { formatRuleItems } from './helpers';

import * as actionTypes from './actionTypes';

const defaultState = Map({
    nomenclatures: Map({}),
    rule: Map({})
});

export const ruleTabReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_RULES:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.set('rule', Map(action.result));
            }
            return state;
        case actionTypes.FETCH_NOMENCLATURES:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.set('nomenclatures', Map(formatRuleItems(action.result.items)));
            }
            return state;
        default:
            return state;
    }
};
