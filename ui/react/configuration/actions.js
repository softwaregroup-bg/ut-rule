import * as actionTypes from './actionTypes';

export function setConfig(config) {
    return {
        type: actionTypes.SET_RULE_CONFIG,
        config: config
    };
}
