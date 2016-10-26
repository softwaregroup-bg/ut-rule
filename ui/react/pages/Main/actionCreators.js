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
        method: 'core.item.fetch',
        params: params || []
    };
};
