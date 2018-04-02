var prepareHistory = require('../../history/prepare');
var historyConfig = require('../../history/config');

const historyTransform = function(objectName, data) {
    return this.bus.importMethod('history.history.transform')({
        config: historyConfig[objectName],
        data
    }).then(function(transformedData) {
        return { data: prepareHistory[objectName] && prepareHistory[objectName](transformedData, data) };
    });
};

var wrapper = {
    'itemName': function(msg, $meta) {
        return this.bus.importMethod('core.itemName.fetch')(msg, $meta);
    },
    'itemCode': function(msg, $meta) {
        return this.bus.importMethod('core.itemCode.fetch')(msg, $meta);
    },
    'agentRole': function(msg, $meta) {
        return this.bus.importMethod('db/integration.agentRole.fetch')(msg, $meta);
    },
    'accountAlias': function(msg, $meta) {
        return this.bus.importMethod('db/integration.alias.list')(msg, $meta);
    },
    'organization': function(msg, $meta) {
        return this.bus.importMethod('customer.organization.fetch')(msg, $meta).then(result => {
            let organization = result.organization;
            return {items: organization.map(v => ({ type: 'organization', value: v.actorId, display: v.organizationName }))};
        });
    },
    'role': function(msg, $meta) {
        return this.bus.importMethod('user.role.fetch')(msg, $meta).then(result => {
            let role = result.role;
            return {items: role.map(v => ({ type: 'role', value: v.actorId, display: v.name }))};
        });
    }
};

module.exports = {
    'item.fetch': function(msg, $meta) {
        var pending = [];

        Object.keys(msg).forEach(function(method) {
            if (wrapper[method] !== undefined && msg[method] && msg[method].length > 0) {
                pending.push(wrapper[method].call(this, {alias: msg[method]}, Object.assign({}, $meta)));
            }
        }, this);

        return Promise.all(pending).then(function(result) {
            var data = [];

            result.forEach(function(item) {
                data = data.concat(item[Object.keys(item)[0]]);
            });

            return {items: data};
        });
    },
    'rule.historyTransform': function(msg, $meta) {
        return historyTransform.call(this, 'organization', msg.data);
    }
};
