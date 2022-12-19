const path = require('path');
module.exports = function sqlTest({config}) {
    return config && {
        schema: [{
            path: path.join(__dirname, 'schema'),
            linkSP: true,
            config
        }]
    };
};
