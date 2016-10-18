import * as actionTypes from './actionTypes';

export function fetch(params) {
    return {
        type: actionTypes.FETCH,
        method: 'rule.rule.fetch',
        params: params || {}
    };
};
