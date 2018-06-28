import { methodRequestState } from 'ut-front-react/constants';
import { formatNomenclatures, prepareRuleModel } from './helpers';
import { fromJS } from 'immutable';
import { getLink } from 'ut-front/react/routerHelper';
import { defaultTabState, emptyLimit, emptySplit, emptyAssignment, emptyRange, defaultErrorState, emptyCumulative } from './Tabs/defaultState';
const __placeholder__ = '__placeholder__';

export function changeRuleProfile(state, action, options) {
    if (action.params.mode && action.params.id) {
        return state.setIn(['config', 'mode'], action.params.mode)
            .setIn(['config', 'id'], action.params.id)
            .setIn([action.params.mode, action.params.id], state.getIn([action.params.mode, action.params.id]) || fromJS(defaultTabState));
    }
    return state;
}

export function fetchNomenclatures(state, action, options) {
    if (action.methodRequestState === methodRequestState.FINISHED) {
        return state.set('nomenclatures', fromJS(formatNomenclatures(action.result.items)))
            .setIn(['config', 'nomenclaturesFetched'], true);
    }
    return state;
}

export function saveRule(state, action, options) {
    if (action.methodRequestState === methodRequestState.FINISHED && !action.error) {
        return state.setIn(['config', 'ruleSaved'], true);
    }
    return state;
}

export function getRule(state, action, options) {
    let { mode, id } = options;
    if (action.methodRequestState === methodRequestState.FINISHED && !action.error) {
        return state.setIn([mode, id], fromJS(prepareRuleModel(action.result)))
            .setIn(['rules', id], action.result);
    }
    return state;
}

export function resetRuleProfile(state, action, options) {
    let { mode, id } = options;
    if (mode === 'create') {
        return state.setIn(['config', 'ruleSaved'], false).setIn([mode, id], fromJS(defaultTabState));
    } else {
        return state.setIn(['config', 'ruleSaved'], false);
    }
}

export function removeTab(state, action, options) {
    if (action.pathname === getLink('ut-rule:create')) {
        state = state.deleteIn(['create', 'create']);
    } else {
        var urlPath = getLink('ut-rule:edit');
        var pathParams = getUrlParams(urlPath, action.pathname);
        if (pathParams) {
            let { id } = pathParams;
            id && (state = state.deleteIn(['edit', id]).deleteIn(['rules', id]));
            if (options.id === id) {
                state = state.setIn(['config', 'ruleSaved'], false);
            }
        }
    }
    return state;
};

export function deleteRule(state, action, options) {
    let { id } = options;
    (action.methodRequestState === methodRequestState.FINISHED) && (action.params.conditionId || []).forEach(function(conId) {
        let conditionId = String(conId);
        if (state.getIn(['rules', conditionId]) || state.getIn(['edit', conditionId])) {
            state = state.deleteIn(['edit', conditionId])
                .deleteIn(['rules', conditionId]);
        }
        if (id === conditionId) {
            state = state.setIn(['config', 'mode'], null).setIn(['config', 'id'], null);
        }
    });
    return state;
}

export function changeActiveTab(state, action, options) {
    let { mode, id } = options;
    if (mode && id && action.params.id) {
        return state.setIn([mode, id, 'activeTab'], action.params.id);
    }
    return state;
}
// error update
export function updateRuleErrors(state, action, options) {
    let { mode, id } = options;
    return state.setIn([mode, id, 'errors'], fromJS(action.params.errors));
}
// common tab actions
export function changeInput(state, action, options) {
    let { mode, id } = options;
    let { error, errorMessage, value, key, clearLinkedErrors } = action.params;
    if (value === __placeholder__ || value === '') value = null;
    state = state.setIn([mode, id, action.destinationProp].concat(key.split(',')), value);
    if (error) {
        return state.setIn([mode, id, 'errors', action.destinationProp].concat(key.split(',')), errorMessage);
    } else {
        // clearLinkedErrors
        [...(clearLinkedErrors || []), key].map((dkey) => {
            state = state.deleteIn([mode, id, 'errors', action.destinationProp].concat(dkey.split(',')));
        });
        return state;
    }
};

export function addProperty(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, action.destinationProp, 'properties'], v => v.push(fromJS({name: '', value: ''})))
        .updateIn([mode, id, 'errors', action.destinationProp, 'properties'], e => e.push(fromJS({})));
}

export function removeProperty(state, action, options) {
    let { mode, id } = options;
    let delPropertyName = state.getIn([mode, id, action.destinationProp, 'properties', action.params.propertyId, 'name']);
    // remove existing property error, if the property have same name as del property
    let errorProperties = [];
    ['channel', 'operation', 'source', 'destination'].forEach((tabName) => {
        state.getIn([mode, id, tabName, 'properties']) && state.getIn([mode, id, tabName, 'properties']).map(function(p, idx) {
            if (p.get('name') === delPropertyName && !(action.destinationProp === tabName && action.params.propertyId === idx)) {
                errorProperties.push({ tabName, idx });
            }
        });
    });
    if (errorProperties.length === 1) {
        state = state.setIn([mode, id, 'errors', errorProperties[0].tabName, 'properties', errorProperties[0].idx], fromJS({}));
    }
    return state.updateIn([mode, id, action.destinationProp, 'properties'], v => v.splice(action.params.propertyId, 1))
        .updateIn([mode, id, 'errors', action.destinationProp, 'properties'], d => d.splice(action.params.propertyId, 1));
}
// limit actions
export function addLimit(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'limit'], v => v.push(fromJS(emptyLimit)))
        .updateIn([mode, id, 'errors', 'limit'], e => e.push(fromJS({})));
}

export function removeLimit(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'limit'], v => v.splice(action.params.limitId, 1))
        .updateIn([mode, id, 'errors', 'limit'], d => d.splice(action.params.limitId, 1));
}

// split actions
export function addAssignment(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'split', 'splits', action.params.splitIndex, 'assignments'], v => v.push(fromJS(emptyAssignment)))
        .updateIn([mode, id, 'errors', 'split', 'splits', action.params.splitIndex, 'assignments'], e => e.push(fromJS({})));
}

export function removeAssignment(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'split', 'splits', action.params.splitIndex, 'assignments'], v => v.splice(action.params.propertyId, 1))
        .updateIn([mode, id, 'errors', 'split', 'splits', action.params.splitIndex, 'assignments'], d => d.splice(action.params.propertyId, 1));
}

export function addCumulative(state, action, options) {
    let { mode, id } = options;
    let { splitIndex } = action.params;
    return state.updateIn([mode, id, 'split', 'splits', splitIndex, 'cumulatives'], v => v.push(fromJS(emptyCumulative)))
        .updateIn([mode, id, 'errors', 'split', 'splits', splitIndex, 'cumulatives'], e => e.push(fromJS({ranges: []})));
}

export function removeCumulative(state, action, options) {
    let { mode, id } = options;
    let { splitIndex, cumulativeId } = action.params;
    return state.updateIn(
        [mode, id, 'split', 'splits', splitIndex, 'cumulatives'],
        v => v.splice(cumulativeId, 1))
        .updateIn([mode, id, 'errors', 'split', 'splits', splitIndex,
            'cumulatives'], d => d.splice(cumulativeId, 1));
}

export function addCumulativeRange(state, action, options) {
    let { mode, id } = options;
    return state.updateIn(
        [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
        v => v.push(fromJS(emptyRange)))
        .updateIn([mode, id, 'errors', 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
            e => e.push(fromJS({})));
}

export function removeCumulativeRange(state, action, options) {
    let { mode, id } = options;
    return state.updateIn(
        [mode, id, 'split', 'splits', action.params.splitIndex, 'cumulatives', action.params.cumulativeId, 'ranges'],
        v => v.splice(action.params.rangeId, 1))
        .updateIn([mode, id, 'errors', 'split', 'splits', action.params.splitIndex,
            'cumulatives', action.params.cumulativeId, 'ranges'], d => d.splice(action.params.rangeId, 1));
}

export function addSplit(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'split', 'splits'], v => v.push(fromJS(emptySplit)))
        .updateIn([mode, id, 'errors', 'split', 'splits'], e => e.push(fromJS(defaultErrorState.split.splits[0])));
}

export function removeSplit(state, action, options) {
    let { mode, id } = options;
    return state.updateIn([mode, id, 'split', 'splits'], v => v.splice(action.params.splitIndex, 1))
        .updateIn([mode, id, 'errors', 'split', 'splits'], d => d.splice(action.params.splitIndex, 1));
}

function getUrlParams(queryPath, pathname) {
    if (pathname.startsWith(queryPath.split(':')[0])) {
        let object = {};
        let pathArray = pathname.split('/');
        queryPath.split('/').forEach(function(rkey, index) {
            if (rkey.match(/^:/)) {
                var key = rkey.slice(1);
                object[key] = pathArray[index];
            }
        });
        return object;
    } else return null;
};
