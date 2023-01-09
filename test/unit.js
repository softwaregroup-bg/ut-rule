const path = require('path');
module.exports = function sqlUnitTest({config}) {
    return config && {seed: [{path: path.join(__dirname, 'unit'), config}]};
};
