import * as actionTypes from './actionTypes';
const defaultState = {};
export default (state = defaultState, action) => {
    if (typeof action.type === 'symbol' && actionTypes[Symbol.keyFor(action.type)]) {
        if (action.result) {
            switch (Symbol.keyFor(action.type)) {
                case 'fetchNomenclatures':
                    return Object.assign({}, state, {'fetchNomenclatures': action.result});
                case 'fetchRules':
                    return Object.assign({}, state, {'fetchRules': action.result});
                case 'removeRules':
                    return state;
                case 'editRule':
                    return state;
            }
        } else if (action.type === actionTypes.reset) {
            return defaultState;
        }
    }
    return state;
};
