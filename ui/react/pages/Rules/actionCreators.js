import * as actionTypes from './actionTypes';

export const updatePagination = (params) => ({type: actionTypes.updatePagination, params});

export function fetchRules(params, showDeleted) {
    return {
        type: actionTypes.fetchRules,
        method: showDeleted ? 'rule.rule.fetchDeleted' : 'rule.rule.fetch',
        params: params || {}
    };
};

export function removeRules(params) {
    return function(dispatch) {
        return dispatch({
            type: actionTypes.removeRules,
            method: 'rule.rule.remove',
            params: params || {}
        }).then((result) => {
            if (result.error) {
                return result;
            }
            return dispatch(fetchRules());
        });
    };
};

export function fetchNomenclatures(params) {
    return {
        type: actionTypes.fetchNomenclatures,
        method: 'rule.item.fetch',
        params
    };
};

export function reset() {
    return {
        type: actionTypes.reset
    };
};

export function toggleRuleOption(key, value) {
    return {
        type: actionTypes.toggleRuleOption,
        params: {
            key,
            value
        }
    };
};
