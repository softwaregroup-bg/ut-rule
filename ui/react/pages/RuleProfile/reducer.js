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
    nomenclaturesFetched: false
});

export const ruleProfileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_NOMENCLATURES:
            if (action.methodRequestState === methodRequestState.FINISHED) {
                return state.set('nomenclatures', fromJS(formatNomenclatures(action.result.items)))
                    .set('nomenclaturesFetched', true);
            }
            return state;
        case actionTypes.CREATE_RULE:
            if (action.methodRequestState === methodRequestState.FINISHED) {
            }
            return state;
        default:
            return state;
    }
};
