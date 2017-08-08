import * as actionTypes from './actionTypes';

export const changeMultiSelectField = (field, newValue) => ({
    type: actionTypes.CHANGE_MULTISELECT_FIELD,
    params: {field, newValue}
});

export const changeDropdownField = (field, newValue) => ({
    type: actionTypes.CHANGE_DROPDOWN_FIELD,
    params: {field, newValue}
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
