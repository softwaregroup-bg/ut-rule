import * as actionTypes from './actionTypes';

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
        else if (obj[key] === null || obj[key] === undefined) delete obj[key];
    });
    return obj;
};

export const updatePagination = (params) => ({ type: actionTypes.updatePagination, params });

export function fetchRules(params, showDeleted) {
    return {
        type: actionTypes.fetchRules,
        method: showDeleted ? 'rule.rule.fetchDeleted' : 'rule.rule.fetch',
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
        const split = JSON.parse(JSON.stringify(params.split));
        split.map(s => {
            s.splitRange = [];
            s.splitCumulative.map(c => {
                c.splitRange.map(r => {
                    r.startAmountDaily = c.dailyAmount;
                    r.startCountDaily = c.dailyCount;
                    r.startAmountMonthly = c.mounthlyAmount;
                    r.startCountMonthly = c.mounthlyCount;
                    r.startAmountWeekly = c.weeklyAmount;
                    r.startCountWeekly = c.weeklyCount;
                    r.startAmountCurrency = c.currency;
                    s.splitRange.push(r);
                });
            });
        });

        split.map(s => {
            removeEmpty(s);
            s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
                tags += tag.key + '|';
                return tags;
            }, '|');
            return s;
        });

        const paramsCondition = params.condition[0];
        const conditionId = paramsCondition.conditionId;

        const condition = [{
            conditionId: conditionId,
            priority: paramsCondition.priority,
            operationStartDate: paramsCondition.operationStartDate,
            operationEndDate: paramsCondition.operationEndDate,
            sourceAccontId: paramsCondition.sourceAccontId,
            destinationAccountId: paramsCondition.destinationAccountId
        }];

        const conditionActor = [];
        const conditionActionFields = {
            channelOrganizationId: 'co',
            channelRoleId: 'co',
            destinationOrganizationId: 'do',
            destinationRoleId: 'do',
            sourceOrganizationId: 'so',
            sourceRoleId: 'so'
        };

        for (const key in conditionActionFields) {
            if (paramsCondition[key]) {
                conditionActor.push({
                    conditionId: conditionId,
                    factor: conditionActionFields[key],
                    actorId: paramsCondition[key]
                });
            }
        }

        const conditionItem = [];
        const conditionItemFields = {
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

        for (const key in conditionItemFields) {
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

        if (paramsCondition.destinationAccountProductId) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'ds',
                itemNameId: paramsCondition.destinationAccountProductId
            });
        }

        if (paramsCondition.sourceAccountProductId) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'ss',
                itemNameId: paramsCondition.sourceAccountProductId
            });
        }

        if (paramsCondition.sourceCardProductId) {
            conditionItem.push({
                conditionId: conditionId,
                factor: 'sc',
                itemNameId: paramsCondition.sourceCardProductId
            });
        }

        const conditionProperty = [];

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

        const modifiedParams = {
            condition,
            conditionActor,
            conditionItem,
            conditionProperty,
            limit: (params.limit || []).map(item => {
                item.minAmount = item.minAmount === '' ? null : item.minAmount;
                item.maxAmount = item.maxAmount === '' ? null : item.maxAmount;
                item.maxAmountDaily = item.maxAmountDaily === '' ? null : item.maxAmountDaily;
                item.maxCountDaily = item.maxCountDaily === '' ? null : item.maxCountDaily;
                item.maxAmountWeekly = item.maxAmountWeekly === '' ? null : item.maxAmountWeekly;
                item.maxCountWeekly = item.maxCountWeekly === '' ? null : item.maxCountWeekly;
                item.maxAmountMonthly = item.maxAmountMonthly === '' ? null : item.maxAmountMonthly;
                item.maxCountMonthly = item.maxCountMonthly === '' ? null : item.maxCountMonthly;
                return item;
            }),
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
        const split = JSON.parse(JSON.stringify(params.split));
        split.map(s => {
            s.splitRange = [];
            s.splitCumulative.map(c => {
                c.splitRange.map(r => {
                    r.startAmountDaily = c.dailyAmount;
                    r.startCountDaily = c.dailyCount;
                    r.startAmountMonthly = c.mounthlyAmount;
                    r.startCountMonthly = c.mounthlyCount;
                    r.startAmountWeekly = c.weeklyAmount;
                    r.startCountWeekly = c.weeklyCount;
                    r.startAmountCurrency = c.currency;
                    s.splitRange.push(r);
                });
            });
        });

        split.map(s => {
            removeEmpty(s);
            s.splitName.tag = s.splitName.tag.reduce((tags, tag) => {
                tags += tag.key + '|';
                return tags;
            }, '|');
            return s;
        });
        const paramsCondition = params.condition[0];

        const condition = [{
            priority: paramsCondition.priority,
            operationStartDate: paramsCondition.operationStartDate,
            operationEndDate: paramsCondition.operationEndDate,
            sourceAccontId: paramsCondition.sourceAccontId,
            destinationAccountId: paramsCondition.destinationAccountId
        }];

        const conditionActor = [];
        const conditionActionFields = {
            channelOrganizationId: 'co',
            channelRoleId: 'co',
            destinationOrganizationId: 'do',
            destinationRoleId: 'do',
            sourceOrganizationId: 'so',
            sourceRoleId: 'so'
        };

        for (const key in conditionActionFields) {
            if (paramsCondition[key]) {
                conditionActor.push({
                    factor: conditionActionFields[key],
                    actorId: paramsCondition[key]
                });
            }
        }

        const conditionItem = [];
        const conditionItemFields = {
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

        for (const key in conditionItemFields) {
            if (paramsCondition[key]) {
                paramsCondition[key].forEach(value => {
                    conditionItem.push({
                        factor: conditionItemFields[key],
                        itemNameId: value.key
                    });
                });
            }
        }

        if (paramsCondition.destinationAccountProductId) {
            conditionItem.push({
                factor: 'ds',
                itemNameId: paramsCondition.destinationAccountProductId
            });
        }

        if (paramsCondition.sourceAccountProductId) {
            conditionItem.push({
                factor: 'ss',
                itemNameId: paramsCondition.sourceAccountProductId
            });
        }

        if (paramsCondition.sourceCardProductId) {
            conditionItem.push({
                factor: 'sc',
                itemNameId: paramsCondition.sourceCardProductId
            });
        }

        const conditionProperty = [];

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

        const modifiedParams = {
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

export function toggleRuleOption(key, value) {
    return {
        type: actionTypes.toggleRuleOption,
        params: {
            key,
            value
        }
    };
};

export function lockUnlockRule(params) {
    return {
        type: actionTypes.lockUnlockRule,
        method: 'rule.rule.lock',
        params
    };
}
