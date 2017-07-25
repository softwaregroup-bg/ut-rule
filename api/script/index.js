var bus;

var wrapper = {
    'itemName': function(msg, $meta) {
        $meta.method = 'core.itemName.fetch';
        return bus.importMethod($meta.method)(msg, $meta);
    },
    'itemCode': function(msg, $meta) {
        $meta.method = 'core.itemCode.fetch';
        return bus.importMethod($meta.method)(msg, $meta);
    },
    'agentRole': function(msg, $meta) {
        $meta.method = 'db/integration.agentRole.fetch';
        return bus.importMethod($meta.method)(msg, $meta);
    },
    'accountAlias': function(msg, $meta) {
        $meta.method = 'db/integration.alias.list';
        return bus.importMethod($meta.method)(msg, $meta);
    },
    'creditAlias': function(msg, $meta) {
        $meta.method = 'db/integration.alias.list';
        return bus.importMethod($meta.method)({ alias: 'credit' }, $meta);
    },
    'debitAlias': function(msg, $meta) {
        $meta.method = 'db/integration.alias.list';
        return bus.importMethod($meta.method)({ alias: 'debit' }, $meta);
    },
    'organization': function(msg, $meta) {
        $meta.method = 'customer.organization.fetch';
        return bus.importMethod($meta.method)(msg, $meta).then(result => {
            let organization = result.organization;
            return {items: organization.map(v => ({ type: 'organization', value: v.actorId, display: v.organizationName }))};
        });
    },
    'role': function(msg, $meta) {
        $meta.method = 'user.role.fetch';
        return bus.importMethod($meta.method)(msg, $meta).then(result => {
            let role = result.role;
            return {items: role.map(v => ({ type: 'role', value: v.actorId, display: v.name }))};
        });
    }
};

module.exports = {
    'item.fetch': function(msg, $meta) {
        bus = this.bus;
        var pending = [];

        Object.keys(msg).forEach(function(method) {
            if (wrapper[method] !== undefined && msg[method] && msg[method].length > 0) {
                // Clone the $meta when executing bus methods in parallel
                pending.push(wrapper[method]({alias: msg[method]}, Object.assign({}, $meta)));
            }
        });

        return Promise.all(pending).then(function(result) {
            var data = [];

            result.forEach(function(item) {
                data = data.concat(item[Object.keys(item)[0]]);
            });

            return {items: data};
        });
    }
};
