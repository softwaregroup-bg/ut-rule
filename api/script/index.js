var prepareHistory = require('../../history/prepare');
var historyConfig = require('../../history/config');
const errorsFactory = require('../../errors');
var wrapper = {
    'itemName': function(msg, $meta) {
        return this.bus.importMethod('core.itemName.fetch')(Object.assign({}, msg, {isEnabled: 1}), $meta);
    },
    'itemCode': function(msg, $meta) {
        return this.bus.importMethod('core.itemCode.fetch')(Object.assign({}, msg, {isEnabled: 1}), $meta);
    },
    'agentRole': function(msg, $meta) {
        return this.bus.importMethod('db/integration.agentRole.fetch')(msg, $meta);
    },
    'accountAlias': function(msg, $meta) {
        return this.bus.importMethod('db/integration.alias.list')(msg, $meta);
    },
    'organization': function(msg, $meta) {
        return this.bus.importMethod('customer.organization.graphFetch')(msg, $meta).then(result => {
            let organizations = result.organization.filter((obj, position, arr) => {
                return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === position;
            });
            return {items: organizations.map(v => ({ type: 'organization', value: v.id, display: v.title }))};
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
    start: function() {
        if (this.errors) {
            Object.assign(this.errors, errorsFactory(this.defineError));
        } else {
            this.errors = errorsFactory(this.defineError);
        }
    },
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
        let objectName = 'rule';
        var rule = prepareHistory[objectName] && prepareHistory[objectName](msg.data);
        return this.bus.importMethod('history.history.transform')({
            config: historyConfig[objectName],
            data: rule || {}
        }).then(function(transformedData) {
            return { data: transformedData };
        });
    }
};
