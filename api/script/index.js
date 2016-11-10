module.exports = {
    'item.fetch': function(msg, $meta) {
        $meta.method = 'core.item.fetch';
        return this.bus.importMethod($meta.method)(msg, $meta);
    }
};
