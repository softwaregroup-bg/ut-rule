import * as actionTypes from './actionTypes';

export function fetchRules(params) {
    return {
        type: actionTypes.fetchRules,
        method: 'rule.rule.fetch',
        params: params || {}
    };
};

export function removeRules(params) {
    return {
        type: actionTypes.removeRules,
        method: 'rule.rule.remove',
        params: params || {}
    };
};

export function editRule(params) {
    return {
        type: actionTypes.editRule,
        method: 'rule.rule.edit',
        params: params || {}
    };
};

export function fetchNomenclatures(params) {
    return {
        type: actionTypes.fetchNomenclatures,
        method: 'rule.item.fetch',
        params: params || []
    };
};

export function reset() {
    return {
        type: actionTypes.reset
    };
};
