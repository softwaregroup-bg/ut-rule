const path = require('path');
module.exports = function sqlTest({config}) {
    return config && {
        seed: [{
            path: path.join(__dirname, 'seed'),
            config: {
                organizationName: 'Software Group',
                ...config
            }
        }]
    };
};
