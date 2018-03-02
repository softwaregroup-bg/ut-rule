var config = require('./config');
var ph = require('./prepare');
/*
        msg and result structure should be
            {
                data: {
                    ...
                }
            }
*/
function transform(msg, objectName) {
    debugger;
    return {
        data: ph[objectName] ? ph[objectName](msg.data, config[objectName]) : msg.data
    };
};
module.exports = {
    transform
};
