var create = require('ut-error').define;

var Rule = create('rule');
var Generic = create('generic', Rule);

module.exports = {
    rule: function(cause) {
        return new Rule(cause);
    },
    generic: function(cause) {
        return new Generic(cause);
    }
};
