import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.FETCH:
            return state;
        default:
            return state;
    }
};
