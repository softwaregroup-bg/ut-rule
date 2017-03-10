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
    }
};

module.exports = {
    'item.fetch': function(msg, $meta) {
        bus = this.bus;
        var pending = [];

        Object.keys(msg).forEach(function(method) {
            if (wrapper[method] !== undefined && msg[method] && msg[method].length > 0) {
                pending.push(wrapper[method]({alias: msg[method]}, $meta));
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
