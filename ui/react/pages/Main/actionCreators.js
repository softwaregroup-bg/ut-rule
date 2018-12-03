import * as actionTypes from './actionTypes';

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
        else if (obj[key] == null) delete obj[key];
    });
    return obj;
};

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

function prepareTags(params) {
    let split = JSON.parse(JSON.stringify(params.split));

    split.map(s => {
        removeEmpty(s);
        s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
            tags += tag.key + '|';
            return tags;
        }, '|');
        return s;
    });
    const operationTag = JSON.parse(JSON.stringify(params.condition[0].operationTag));
    const tagKeys = Array.isArray(operationTag) ? operationTag.map(tag => tag.key) : [];
    params.condition[0].operationTag = tagKeys.length > 0 ? ('|' + tagKeys.join('|') + '|') : null;

    params.split = {data: {rows: split}};
    return params;
}

export function editRule(params) {
    prepareTags(params);

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
        prepareTags(params);

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
