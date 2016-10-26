import * as actionTypes from './actionTypes';

export function fetch(params) {
    return {
        type: actionTypes.fetch,
        method: 'rule.rule.fetch',
        params: params || {}
    };
};
