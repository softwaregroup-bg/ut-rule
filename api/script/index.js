module.exports = {
    'item.fetch': function(msg, $meta) {
        $meta.method = 'core.itemName.fetch';
        return this.bus.importMethod($meta.method)(msg, $meta);
    },
    'role.fetch': function(msg, $meta) {
        $meta.method = 'user.role.fetch';
        return this.bus.importMethod($meta.method)(msg, $meta);
    },
    'alias.fetch': function(msg, $meta) {
        $meta.method = msg.method;
        return this.bus.importMethod($meta.method)(msg, $meta);
    }
};
