var path = require('path');
require('../../errors');
module.exports = {
    schema: [{path: path.join(__dirname, 'schema'), linkSP: true}]
};
