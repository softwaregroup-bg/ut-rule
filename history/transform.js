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
    return {
        data: ph[objectName] ? ph[objectName](msg.data) : msg.data
    };
};
module.exports = {
    transform
};
