import * as actionTypes from './actionTypes';

// common actions
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

// channel actions
export const changeMultiSelectField = (field, newValue, destinationProp) => ({
    type: actionTypes.CHANGE_MULTISELECT_FIELD,
    params: {field, newValue},
    destinationProp
});

export const changeDropdownField = (field, newValue, destinationProp) => ({
    type: actionTypes.CHANGE_DROPDOWN_FIELD,
    params: {field, newValue},
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

export const setPropertyField = (propertyId, field, newValue, destinationProp) => ({
    type: actionTypes.SET_PROPERTY_FIELD,
    params: {propertyId, field, newValue},
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

export const setLimitField = (limitId, field, newValue) => ({
    type: actionTypes.SET_LIMIT_FIELD,
    params: {limitId, field, newValue}
});

export const addAssignment = (splitIndex) => ({
    type: actionTypes.ADD_ASSIGNMENT,
    params: {splitIndex}
});

export const removeAssignment = (splitIndex, propertyId) => ({
    type: actionTypes.REMOVE_ASSIGNMENT,
    params: {splitIndex, propertyId}
});

export const setAssignmentField = (splitIndex, propertyId, field, newValue) => ({
    type: actionTypes.SET_ASSIGNMENT_FIELD,
    params: {splitIndex, propertyId, field, newValue}
});

export const addCumulative = (splitIndex) => ({
    type: actionTypes.ADD_CUMULATIVE,
    params: {splitIndex}
});

export const removeCumulative = (splitIndex, propertyId) => ({
    type: actionTypes.REMOVE_CUMULATIVE,
    params: {splitIndex, propertyId}
});

export const setCumulativeField = (splitIndex, cumulativeId, field, newValue) => ({
    type: actionTypes.SET_CUMULATIVE_FIELD,
    params: {splitIndex, cumulativeId, field, newValue}
});

export const changeInputField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_INPUT_FIELD,
    params: {splitIndex, field, newValue}
});

export const addCumulativeRange = (splitIndex, cumulativeId) => ({
    type: actionTypes.ADD_CUMULATIVE_RANGE,
    params: {splitIndex, cumulativeId}
});

export const removeCumulativeRange = (splitIndex, cumulativeId, rangeId) => ({
    type: actionTypes.REMOVE_CUMULATIVE_RANGE,
    params: {splitIndex, cumulativeId, rangeId}
});

export const setCumulativeRangeField = (splitIndex, cumulativeId, rangeId, field, newValue) => ({
    type: actionTypes.SET_CUMULATIVE_RANGE_FIELD,
    params: {splitIndex, cumulativeId, rangeId, field, newValue}
});

export const addSplit = () => ({
    type: actionTypes.ADD_SPLIT
});

export const removeSplit = (splitIndex) => ({
    type: actionTypes.REMOVE_SPLIT,
    params: {splitIndex}
});

export const changeSplitMultiSelectField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_SPLIT_MULTISELECT_FIELD,
    params: {splitIndex, field, newValue}
});

export const changeSplitDropdownField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_SPLIT_DROPDOWN_FIELD,
    params: {splitIndex, field, newValue}
});

export const changeSplitInputField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_SPLIT_INPUT_FIELD,
    params: {splitIndex, field, newValue}
});
