module.exports = {
    'item.fetch': function(msg, $meta) {
        $meta.method = 'core.itemName.fetch';
        return this.bus.importMethod($meta.method)(msg, $meta);
    }
};
