import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    if (typeof action.type === 'symbol' && actionTypes[Symbol.keyFor(action.type)]) {
        if (action.result) {
            return Object.assign({}, state, {[Symbol.keyFor(action.type)]: action.result});
        } else if (action.type === actionTypes.reset) {
            return defaultState;
        }
    }
    return state;
};
