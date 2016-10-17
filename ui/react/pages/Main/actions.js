import * as actionTypes from './actionTypes';

export const fetchData = (params) => {
    return {
        type: actionTypes.FETCH,
        params: params
    };
};
