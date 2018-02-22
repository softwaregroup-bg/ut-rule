import * as actionTypes from './actionTypes';

export const changeMultiSelectField = (field, newValue) => ({
    type: actionTypes.CHANGE_MULTISELECT_FIELD,
    params: {field, newValue}
});

export const changeDropdownField = (field, newValue) => ({
    type: actionTypes.CHANGE_DROPDOWN_FIELD,
    params: {field, newValue}
});

export const addProperty = () => ({
    type: actionTypes.ADD_PROPERTY
});

export const removeProperty = (propertyId) => ({
    type: actionTypes.REMOVE_PROPERTY,
    params: {propertyId}
});

export const setPropertyField = (propertyId, field, newValue) => ({
    type: actionTypes.SET_PROPERTY_FIELD,
    params: {propertyId, field, newValue}
});
