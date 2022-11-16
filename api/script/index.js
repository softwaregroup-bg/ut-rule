const prepareHistory = require('../../history/prepare');
const historyConfig = require('../../history/config');
const wrapper = {
    itemName: function(msg, $meta) {
        return this.bus.importMethod('core.itemName.fetch')(msg, $meta);
    },
    itemCode: function(msg, $meta) {
        return this.bus.importMethod('core.itemCode.fetch')(msg, $meta);
    },
    agentRole: function(msg, $meta) {
        return this.bus.importMethod('db/integration.agentRole.fetch')(msg, $meta);
    },
    accountAlias: function(msg, $meta) {
        return this.bus.importMethod('db/integration.alias.list')(msg, $meta);
    },
    organization: function(msg, $meta) {
        return this.bus.importMethod('customer.organization.graphFetch')(msg, $meta).then(result => {
            const organizations = result.organization.filter((obj, position, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === position;
            });
            return {items: organizations.map(v => ({ type: 'organization', value: v.id, display: v.title }))};
        });
    },
    role: function(msg, $meta) {
        return this.bus.importMethod('user.role.fetch')(msg, $meta).then(result => {
            const role = result.role;
            return {items: role.map(v => ({ type: 'role', value: v.actorId, display: v.name }))};
        });
    }
};

const tag = factor => value => {
    if (typeof value?.split !== 'function') return;
    const [name, ...rest] = value.split('=');
    return {
        factor,
        name,
        value: rest.join('=') || '1'
    };
};

function conditionSend({
    source,
    destination,
    operation,
    channel,
    splitName,
    splitAssignment,
    splitRange,
    splitAnalytic,
    ...params
}) {
    return {
        ...params,
        conditionProperty: []
            .concat(operation?.tag?.split(' ').map(tag('oc')))
            .concat(channel?.actorTag?.split(' ').map(tag('co')))
            .concat(source?.actorTag?.split(' ').map(tag('so')))
            .concat(destination?.actorTag?.split(' ').map(tag('do')))
            .concat(source?.kyc?.map(value => ({factor: 'sk', name: 'source.kyc', value})))
            .concat(source?.customerType?.map(value => ({factor: 'st', name: 'source.customerType', value})))
            .concat(destination?.kyc?.map(value => ({factor: 'dk', name: 'destination.kyc', value})))
            .concat(destination?.customerType?.map(value => ({factor: 'dt', name: 'destination.customerType', value})))
            .filter(Boolean),
        conditionActor: []
            .concat(channel?.actor?.map(actorId => ({actorId, factor: 'co', type: 'organization'})))
            .concat(destination?.actor?.map(actorId => ({actorId, factor: 'do', type: 'organization'})))
            .concat(source?.actor?.map(actorId => ({actorId, factor: 'so', type: 'organization'})))
            .filter(Boolean),
        conditionItem: []
            .concat(operation?.type?.map(itemNameId => ({itemNameId, factor: 'oc', type: 'operation'})))
            .concat(channel?.country?.map(itemNameId => ({itemNameId, factor: 'cs', type: 'country'})))
            .concat(channel?.region?.map(itemNameId => ({itemNameId, factor: 'cs', type: 'region'})))
            .concat(channel?.city?.map(itemNameId => ({itemNameId, factor: 'cs', type: 'city'})))
            .concat(source?.country?.map(itemNameId => ({itemNameId, factor: 'ss', type: 'country'})))
            .concat(source?.region?.map(itemNameId => ({itemNameId, factor: 'ss', type: 'region'})))
            .concat(source?.city?.map(itemNameId => ({itemNameId, factor: 'ss', type: 'city'})))
            .concat(source?.cardProduct?.map(itemNameId => ({itemNameId, factor: 'sc', type: 'cardProduct'})))
            .concat(source?.accountProduct?.map(itemNameId => ({itemNameId, factor: 'sc', type: 'accountProduct'})))
            .concat(destination?.country?.map(itemNameId => ({itemNameId, factor: 'ds', type: 'country'})))
            .concat(destination?.region?.map(itemNameId => ({itemNameId, factor: 'ds', type: 'region'})))
            .concat(destination?.city?.map(itemNameId => ({itemNameId, factor: 'ds', type: 'city'})))
            .concat(destination?.cardProduct?.map(itemNameId => ({itemNameId, factor: 'dc', type: 'cardProduct'})))
            .concat(destination?.accountProduct?.map(itemNameId => ({itemNameId, factor: 'dc', type: 'accountProduct'})))
            .filter(Boolean),
        split: {
            data: {
                rows: splitName?.map(item => ({
                    splitName: {
                        ...item,
                        tag: item.tag ? `|${item.tag.join('|')}|` : null
                    },
                    splitRange: splitRange?.filter(range => range.splitNameId === item.splitNameId),
                    splitAssignment: splitAssignment?.filter(assignment => assignment.splitNameId === item.splitNameId).map(assignment => ({
                        ...assignment,
                        splitAnalytic: splitAnalytic?.filter(analytic => analytic.splitAssignmentId === assignment.splitAssignmentId)
                    }))
                })) || []
            }
        }
    };
}

function conditionReceive({
    conditionItem,
    conditionActor,
    conditionProperty,
    splitName,
    ...response
}) {
    function get(list, factor, type, key) {
        return list.filter(item => item.factor === factor && item.type === type).map(item => Number(item[key]));
    }
    function getProp(list, factor, name) {
        return list.filter(item => item.factor === factor && item.name === name).map(item => Number(item.value));
    }
    function getTag(list, factor) {
        return list.filter(item => item.factor === factor).map(({name, value}) => (value && value !== '1') ? `${name}=${value}` : name).join(' ');
    }
    return {
        ...response,
        splitName: splitName.map(item => ({
            ...item,
            tag: item.tag?.split('|').filter(Boolean) || []
        })),
        operation: {
            tag: getTag(conditionProperty, 'oc'),
            type: get(conditionItem, 'oc', 'operation', 'itemNameId')
        },
        channel: {
            actor: get(conditionActor, 'co', 'organization', 'actorId'),
            actorTag: getTag(conditionProperty, 'co'),
            country: get(conditionItem, 'cs', 'country', 'itemNameId'),
            region: get(conditionItem, 'cs', 'region', 'itemNameId'),
            city: get(conditionItem, 'cs', 'city', 'itemNameId')
        },
        source: {
            actor: get(conditionActor, 'so', 'organization', 'actorId'),
            actorTag: getTag(conditionProperty, 'so'),
            kyc: getProp(conditionProperty, 'sk', 'source.kyc'),
            customerType: getProp(conditionProperty, 'st', 'source.customerType'),
            cardProduct: get(conditionItem, 'sc', 'cardProduct', 'itemNameId'),
            accountProduct: get(conditionItem, 'sc', 'accountProduct', 'itemNameId'),
            country: get(conditionItem, 'ss', 'country', 'itemNameId'),
            region: get(conditionItem, 'ss', 'region', 'itemNameId'),
            city: get(conditionItem, 'ss', 'city', 'itemNameId')
        },
        destination: {
            actor: get(conditionActor, 'do', 'organization', 'actorId'),
            actorTag: getTag(conditionProperty, 'do'),
            kyc: getProp(conditionProperty, 'dk', 'destination.kyc'),
            customerType: getProp(conditionProperty, 'dt', 'destination.customerType'),
            cardProduct: get(conditionItem, 'dc', 'cardProduct', 'itemNameId'),
            accountProduct: get(conditionItem, 'dc', 'accountProduct', 'itemNameId'),
            country: get(conditionItem, 'ds', 'country', 'itemNameId'),
            region: get(conditionItem, 'ds', 'region', 'itemNameId'),
            city: get(conditionItem, 'ds', 'city', 'itemNameId')
        }
    };
}

function describe(conditionId, factor, name, value) {
    return item =>
        item &&
        (item.conditionId === conditionId) &&
        (item.factor === factor) &&
        item[name] &&
        (item[value] === '1' ? [item[name]] : [item[name], item[value]]);
}

function conditionMap({
    condition,
    conditionItem,
    conditionActor,
    conditionProperty,
    ...rest
}) {
    return {
        ...rest,
        condition: condition.map(row => ({
            ...row,
            operation: [
                row.operationStartDate && ['Start Date', new Date(row.operationStartDate).toLocaleString()],
                row.operationEndDate && ['End Date', new Date(row.operationEndDate).toLocaleString()]
            ]
                .concat(conditionItem.map(describe(row.conditionId, 'oc', 'itemTypeName', 'itemName')))
                .concat(conditionProperty.map(describe(row.conditionId, 'oc', 'name', 'value')))
                .filter(Boolean),
            channel: []
                .concat(conditionItem.map(describe(row.conditionId, 'cs', 'itemTypeName', 'itemName')))
                .concat(conditionActor.map(describe(row.conditionId, 'co', 'type', 'organizationName')))
                .concat(conditionProperty.map(describe(row.conditionId, 'co', 'name', 'value')))
                .filter(Boolean),
            source: []
                .concat(conditionItem.map(describe(row.conditionId, 'sc', 'itemTypeName', 'itemName')))
                .concat(conditionItem.map(describe(row.conditionId, 'ss', 'itemTypeName', 'itemName')))
                .concat(conditionActor.map(describe(row.conditionId, 'so', 'type', 'organizationName')))
                .concat(conditionProperty.map(describe(row.conditionId, 'sc', 'name', 'value')))
                .concat(row.sourceAccountId && [['Account', row.sourceAccountId]])
                .filter(Boolean),
            destination: []
                .concat(conditionItem.map(describe(row.conditionId, 'dc', 'itemTypeName', 'itemName')))
                .concat(conditionItem.map(describe(row.conditionId, 'ds', 'itemTypeName', 'itemName')))
                .concat(conditionActor.map(describe(row.conditionId, 'do', 'type', 'organizationName')))
                .concat(conditionProperty.map(describe(row.conditionId, 'dc', 'name', 'value')))
                .concat(row.destinationAccountId && [['Account', row.destinationAccountId]])
                .filter(Boolean)
        }))
    };
}

module.exports = function rule({
    import: {
        db$ruleRuleFetch,
        db$ruleRuleAdd,
        db$ruleRuleEdit
    }
}) {
    return {
        async 'rule.condition.add'(condition, $meta) {
            return conditionReceive(await db$ruleRuleAdd(conditionSend(condition), $meta));
        },
        async 'rule.condition.edit'(condition, $meta) {
            return conditionReceive(await db$ruleRuleEdit(conditionSend(condition), $meta));
        },
        async 'rule.condition.fetch'(params, $meta) {
            return conditionMap(await db$ruleRuleFetch(params, $meta));
        },
        async 'rule.condition.get'(params, $meta) {
            return conditionReceive(await db$ruleRuleFetch(params, $meta));
        },
        'rule.item.fetch': function(msg, $meta) {
            const pending = [];

            Object.keys(msg).forEach(function(method) {
                if (wrapper[method] !== undefined && msg[method] && msg[method].length > 0) {
                    const params = {
                        alias: msg[method]
                    };
                    if (msg.skipDisabled && msg.skipDisabled.includes(method)) {
                        params.isEnabled = 1;
                    }
                    pending.push(wrapper[method].call(this, params, Object.assign({}, $meta)));
                }
            }, this);

            return Promise.all(pending).then(function(result) {
                let data = [];

                result.forEach(function(item) {
                    data = data.concat(item[Object.keys(item)[0]]);
                });

                return {items: data};
            });
        },
        'rule.rule.historyTransform': function(msg, $meta) {
            const objectName = 'rule';
            const rule = prepareHistory[objectName] && prepareHistory[objectName](msg.data);
            return this.bus.importMethod('history.history.transform')({
                config: historyConfig[objectName],
                data: rule || {}
            }).then(function(transformedData) {
                return { data: transformedData };
            });
        }
    };
};
