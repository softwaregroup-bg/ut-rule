import * as actionTypes from './actionTypes';
function setState(state, action) {
    return Object.assign({}, state, {[action.type]: action});
}
const defaultState = {
    [actionTypes.FETCH]: {}
};
export default (state = defaultState, action) => {
    if (action.methodRequestState === 'requested') { // dont't rerender anything when request is still pending
        return state;
    }
    switch (action.type) {
        case actionTypes.FETCH:
            return setState(state, action);
        default:
            return state;
    }
};
