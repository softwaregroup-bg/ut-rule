var path = require('path');
require('./errors');
module.exports = {
    sql: {
        schema: [{
            path: path.join(__dirname, 'schema', 'sql'),
            linkSP: true
        }]
    },
    postgres: {
        schema: [{
            path: path.join(__dirname, 'schema', 'postgres'),
            linkSP: true
        }]
    }
};
