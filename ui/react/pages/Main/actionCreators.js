import * as actionTypes from './actionTypes';

export function fetchRules(params) {
    return {
        type: actionTypes.rules,
        method: 'rule.rule.fetch',
        params: params || {}
    };
};

export function fetchNomenclatures(params) {
    return {
        type: actionTypes.nomenclatures,
        method: 'rule.item.fetch',
        params: params || []
    };
};
