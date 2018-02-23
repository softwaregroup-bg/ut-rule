import { fromJS } from 'immutable';
import { methodRequestState } from 'ut-front-react/constants';

import { formatNomenclatures } from './helpers';

import * as actionTypes from './actionTypes';

const defaultState = fromJS({
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
        activeTab: 1
    }
});

export const ruleProfileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_NOMENCLATURES:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.set('nomenclatures', fromJS(formatNomenclatures(action.result.items)))
                    .setIn(['config', 'nomenclaturesFetched'], true);
            }
            return state;
        case actionTypes.CREATE_RULE:
            if (action.methodRequestState === methodRequestState.FINISHED && !action.error) {
                return state.setIn(['config', 'ruleSaved'], true);
            }
            return state;
        case actionTypes.RESET_RULE_STATE:
            return state.setIn(['config', 'ruleSaved'], false);
        default:
            return state;
    }
};
