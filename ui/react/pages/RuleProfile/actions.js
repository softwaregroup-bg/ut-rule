import * as actionTypes from './actionTypes';

// common actions
export const fetchNomenclatures = (params) => ({
    type: actionTypes.FETCH_NOMENCLATURES,
    method: 'rule.item.fetch',
    params: params || {}
});

export const getRule = (conditionId) => ({
    type: actionTypes.GET_RULE,
    method: 'rule.rule.fetch',
    params: { conditionId }
});

export const createRule = (params) => ({
    type: actionTypes.CREATE_RULE,
    method: 'rule.rule.add',
    params: params || {}
});

export const editRule = (params) => ({
    type: actionTypes.EDIT_RULE,
    method: 'rule.rule.edit',
    params: params || {}
});

export const resetRuleState = (params) => ({
    type: actionTypes.RESET_RULE_STATE
});

export const changeRuleProfile = (mode, id) => ({
    type: actionTypes.CHANGE_RULE_PROFILE,
    params: {mode, id}
});

export const changeActiveTab = (tab) => ({
    type: actionTypes.CHANGE_ACTIVE_TAB,
    params: {...tab}
});

// channel actions
export const changeInput = (params, destinationProp) => ({
    type: actionTypes.CHANGE_INPUT,
    params: params || {},
    destinationProp
});

export const addProperty = (destinationProp) => ({
    type: actionTypes.ADD_PROPERTY,
    destinationProp
});

export const removeProperty = (propertyId, destinationProp) => ({
    type: actionTypes.REMOVE_PROPERTY,
    params: {propertyId},
    destinationProp
});

export const addLimit = () => {
    return {
        type: actionTypes.ADD_LIMIT
    };
};

export const removeLimit = (limitId) => ({
    type: actionTypes.REMOVE_LIMIT,
    params: {limitId}
});

export const addAssignment = (splitIndex) => ({
    type: actionTypes.ADD_ASSIGNMENT,
    params: {splitIndex}
});

export const removeAssignment = (splitIndex, propertyId) => ({
    type: actionTypes.REMOVE_ASSIGNMENT,
    params: {splitIndex, propertyId}
});

export const addCumulative = (splitIndex) => {
    return {
        type: actionTypes.ADD_CUMULATIVE,
        params: {splitIndex}
    };
};

export const removeCumulative = (splitIndex, cumulativeId) => ({
    type: actionTypes.REMOVE_CUMULATIVE,
    params: {splitIndex, cumulativeId}
});

export const addCumulativeRange = (splitIndex, cumulativeId) => ({
    type: actionTypes.ADD_CUMULATIVE_RANGE,
    params: {splitIndex, cumulativeId}
});

export const removeCumulativeRange = (splitIndex, cumulativeId, rangeId) => ({
    type: actionTypes.REMOVE_CUMULATIVE_RANGE,
    params: {splitIndex, cumulativeId, rangeId}
});

export const addSplit = () => ({
    type: actionTypes.ADD_SPLIT
});

export const removeSplit = (splitIndex) => ({
    type: actionTypes.REMOVE_SPLIT,
    params: {splitIndex}
});

export const updateRuleErrors = (errors) => ({
    type: actionTypes.UPDATE_RULE_ERRORS,
    params: {errors}
});
