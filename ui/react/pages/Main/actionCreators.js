import * as actionTypes from './actionTypes';

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
        else if (obj[key] === null || obj[key] === undefined) delete obj[key];
    });
    return obj;
};

export function fetchRules(params) {
    return {
        type: actionTypes.fetchRules,
        method: 'db/rule.rule.fetch',
        params: params || {}
    };
};

export function fetchRoles(params) {
    return {
        type: actionTypes.fetchRoles,
        method: 'user.role.fetch',
        params: params || {}
    };
};

export function fetchOrganizations(params) {
    return {
        type: actionTypes.fetchOrganizations,
        method: 'customer.organization.fetch',
        params: params || {}
    };
};

export function fetchSupervisor(params) {
    return {
        type: actionTypes.fetchRules,
        method: '',
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
        let split = JSON.parse(JSON.stringify(params.split));

        split.map(s => {
            removeEmpty(s);
            s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
                tags += tag.key + '|';
                return tags;
            }, '|');
            return s;
        });

        let paramsCondition = params.condition[0];
        let conditionId = paramsCondition.conditionId;

        let condition = [{
            conditionId: conditionId,
            priority: paramsCondition.priority,
            operationStartDate: paramsCondition.operationStartDate,
            operationEndDate: paramsCondition.operationEndDate,
            sourceAccontId: paramsCondition.sourceAccontId,
            destinationAccountId: paramsCondition.destinationAccountId
        }];

        let conditionActor = [];
        let conditionActionFields = {
            channelOrganizationId: 'co',
            channelRoleId: 'co',
            destinationOrganizationId: 'do',
            destinationRoleId: 'do',
            sourceOrganizationId: 'so',
            sourceRoleId: 'so'
        };

        for (var key in conditionActionFields) {
            if (paramsCondition[key]) {
                conditionActor.push({
                    conditionId: conditionId,
                    factor: conditionActionFields[key],
                    actorId: paramsCondition[key]
                });
            }
        }

        let conditionItem = [];
        let conditionItemFields = {
            channelCityIds: 'cs',
            channelCountryIds: 'cs',
            channelRegionIds: 'cs',
            destinationCityIds: 'ds',
            destinationCountryIds: 'ds',
            destinationRegionIds: 'ds',
            sourceCityIds: 'ss',
            sourceCountryIds: 'ss',
            sourceRegionIds: 'ss',
            operationIds: 'oc'
        };

        for (key in conditionItemFields) {
            if (paramsCondition[key]) {
                paramsCondition[key].forEach(value => {
                    conditionItem.push({
                        conditionId: conditionId,
                        factor: conditionItemFields[key],
                        itemNameId: value.key
                    });
                });
            }
        }

        if (paramsCondition['destinationAccountProductId']) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'ds',
                itemNameId: paramsCondition['destinationAccountProductId']
            });
        }

        if (paramsCondition['sourceAccountProductId']) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'ss',
                itemNameId: paramsCondition['sourceAccountProductId']
            });
        }

        if (paramsCondition['sourceCardProductId']) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'ss',
                itemNameId: paramsCondition['sourceCardProductId']
            });
        }

        let conditionProperty = [];

        params.channelProperties.forEach((property) => {
            conditionProperty.push({
                conditionId: conditionId,
                factor: 'co',
                name: property.name,
                value: property.value
            });
        });

        params.destinationProperties.forEach((property) => {
            conditionProperty.push({
                conditionId: conditionId,
                factor: 'do',
                name: property.name,
                value: property.value
            });
        });

        params.operationProperties.forEach((property) => {
            conditionProperty.push({
                conditionId: conditionId,
                factor: 'oc',
                name: property.name,
                value: property.value
            });
        });

        params.sourceProperties.forEach((property) => {
            conditionProperty.push({
                conditionId: conditionId,
                factor: 'so',
                name: property.name,
                value: property.value
            });
        });

        var modifiedParams = {
            condition,
            conditionActor,
            conditionItem,
            conditionProperty,
            limit: params.limit,
            split: { data: { rows: split } }
        };

        return dispatch({
            type: actionTypes.addRule,
            method: 'rule.rule.edit',
            params: modifiedParams || {}
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
            removeEmpty(s);
            s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
                tags += tag.key + '|';
                return tags;
            }, '|');
            return s;
        });

        let paramsCondition = params.condition[0];

        let condition = [{
            priority: paramsCondition.priority,
            operationStartDate: paramsCondition.operationStartDate,
            operationEndDate: paramsCondition.operationEndDate,
            sourceAccontId: paramsCondition.sourceAccontId,
            destinationAccountId: paramsCondition.destinationAccountId
        }];

        let conditionActor = [];
        let conditionActionFields = {
            channelOrganizationId: 'co',
            channelRoleId: 'co',
            destinationOrganizationId: 'do',
            destinationRoleId: 'do',
            sourceOrganizationId: 'so',
            sourceRoleId: 'so'
        };

        for (var key in conditionActionFields) {
            if (paramsCondition[key]) {
                conditionActor.push({
                    factor: conditionActionFields[key],
                    actorId: paramsCondition[key]
                });
            }
        }

        let conditionItem = [];
        let conditionItemFields = {
            channelCityIds: 'cs',
            channelCountryIds: 'cs',
            channelRegionIds: 'cs',
            destinationCityIds: 'ds',
            destinationCountryIds: 'ds',
            destinationRegionIds: 'ds',
            sourceCityIds: 'ss',
            sourceCountryIds: 'ss',
            sourceRegionIds: 'ss',
            operationIds: 'oc'
        };

        for (key in conditionItemFields) {
            if (paramsCondition[key]) {
                paramsCondition[key].forEach(value => {
                    conditionItem.push({
                        factor: conditionItemFields[key],
                        itemNameId: value.key
                    });
                });
            }
        }

        if (paramsCondition['destinationAccountProductId']) {
            conditionItem.push({
                factor: 'ds',
                itemNameId: paramsCondition['destinationAccountProductId']
            });
        }

        if (paramsCondition['sourceAccountProductId']) {
            conditionItem.push({
                factor: 'ss',
                itemNameId: paramsCondition['sourceAccountProductId']
            });
        }

        if (paramsCondition['sourceCardProductId']) {
            conditionItem.push({
                factor: 'ss',
                itemNameId: paramsCondition['sourceCardProductId']
            });
        }

        let conditionProperty = [];

        params.channelProperties.forEach((property) => {
            conditionProperty.push({
                factor: 'co',
                name: property.name,
                value: property.value
            });
        });

        params.destinationProperties.forEach((property) => {
            conditionProperty.push({
                factor: 'do',
                name: property.name,
                value: property.value
            });
        });

        params.operationProperties.forEach((property) => {
            conditionProperty.push({
                factor: 'oc',
                name: property.name,
                value: property.value
            });
        });

        params.sourceProperties.forEach((property) => {
            conditionProperty.push({
                factor: 'so',
                name: property.name,
                value: property.value
            });
        });

        var modifiedParams = {
            condition,
            conditionActor,
            conditionItem,
            conditionProperty,
            limit: params.limit,
            split: { data: { rows: split } }
        };

        return dispatch({
            type: actionTypes.addRule,
            method: 'rule.rule.add',
            params: modifiedParams || {}
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
