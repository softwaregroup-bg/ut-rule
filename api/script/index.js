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
    ...params
}) {
    return {
        ...params,
        conditionProperty: []
            .concat(operation?.tag?.split(' ').map(tag('oc')))
            .concat(channel?.actorTag?.split(' ').map(tag('co')))
            .concat(source?.actorTag?.split(' ').map(tag('so')))
            .concat(destination?.actorTag?.split(' ').map(tag('do')))
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
            .filter(Boolean)
    };
}

function conditionReceive({
    conditionItem,
    conditionActor,
    conditionProperty,
    ...response
}) {
    function get(list, factor, type, key) {
        return list.filter(item => item.factor === factor && item.type === type).map(item => Number(item[key]));
    }
    function getTag(list, factor) {
        return list.filter(item => item.factor === factor).map(({name, value}) => (value && value !== '1') ? `${name}=${value}` : name).join(' ');
    }
    return {
        ...response,
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
            cardProduct: get(conditionItem, 'sc', 'cardProduct', 'itemNameId'),
            accountProduct: get(conditionItem, 'sc', 'accountProduct', 'itemNameId'),
            country: get(conditionItem, 'ss', 'country', 'itemNameId'),
            region: get(conditionItem, 'ss', 'region', 'itemNameId'),
            city: get(conditionItem, 'ss', 'city', 'itemNameId')
        },
        destination: {
            actor: get(conditionActor, 'do', 'organization', 'actorId'),
            actorTag: getTag(conditionProperty, 'do'),
            cardProduct: get(conditionItem, 'dc', 'cardProduct', 'itemNameId'),
            accountProduct: get(conditionItem, 'dc', 'accountProduct', 'itemNameId'),
            country: get(conditionItem, 'ds', 'country', 'itemNameId'),
            region: get(conditionItem, 'ds', 'region', 'itemNameId'),
            city: get(conditionItem, 'ds', 'city', 'itemNameId')
        }
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
            return db$ruleRuleFetch(params, $meta);
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
