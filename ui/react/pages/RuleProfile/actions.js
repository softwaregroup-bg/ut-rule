import * as actionTypes from './actionTypes';

export const fetchNomenclatures = (params) => ({
    type: actionTypes.FETCH_NOMENCLATURES,
    method: 'rule.item.fetch',
    params: params || {}
});

export const createRule = (params) => ({
    type: actionTypes.CREATE_RULE,
    method: 'rule.rule.add',
    params: params || {}
});

export const resetRuleState = (params) => ({
    type: actionTypes.RESET_RULE_STATE
});
