import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    if (action.result && typeof action.type === 'symbol' && actionTypes[Symbol.keyFor(action.type)]) {
        return Object.assign({}, state, {[Symbol.keyFor(action.type)]: action.result});
    }
    return state;
};
