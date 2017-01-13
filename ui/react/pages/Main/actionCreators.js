import * as actionTypes from './actionTypes';

export function fetchRules(params) {
    return {
        type: actionTypes.fetchRules,
        method: 'rule.rule.fetch',
        params: params || {}
    };
};

export function removeRules(params) {
    return function(dispatch) {
        return dispatch({
            type: actionTypes.removeRules,
            method: 'rule.rule.remove',
            params: params || {}
        }).then((result) => {
            if (result.error) {
                return result;
            }
            return dispatch(fetchRules());
        });
    };
};

export function editRule(params) {
    return function(dispatch) {
        return dispatch({
            type: actionTypes.editRule,
            method: 'rule.rule.edit',
            params: params || {}
        }).then((result) => {
            if (result.error) {
                return result;
            }
            return dispatch(fetchRules());
        });
    };
};

export function addRule(params) {
    return function(dispatch) {
        let split = JSON.parse(JSON.stringify(params.split));
        split.map(s => {
            s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
                tags += tag.key + '|';
                return tags;
            }, '|');
            return s;
        });
        params.split = {data: {rows: split}};
        debugger;
        return dispatch({
            type: actionTypes.addRule,
            method: 'rule.rule.add',
            params: params || {}
        }).then((result) => {
            if (result.error) {
                return result;
            }
            return dispatch(fetchRules());
        });
    };
};

export function fetchNomenclatures(params) {
    return {
        type: actionTypes.fetchNomenclatures,
        method: 'rule.item.fetch',
        params: params
    };
};

export function reset() {
    return {
        type: actionTypes.reset
    };
};
