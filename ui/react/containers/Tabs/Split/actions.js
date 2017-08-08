import * as actionTypes from './actionTypes';

export const changeMultiSelectField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_MULTISELECT_FIELD,
    params: {splitIndex, field, newValue}
});

export const changeDropdownField = (splitIndex, field, newValue) => ({
    type: actionTypes.CHANGE_DROPDOWN_FIELD,
    params: {splitIndex, field, newValue}
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
