const path = require('path');
module.exports = function sqlTest({config}) {
    return config && {
        namespace: 'integration',
        schema: [{
            path: path.join(__dirname, 'schema'),
            linkSP: true,
            config
        }]
    };
};
