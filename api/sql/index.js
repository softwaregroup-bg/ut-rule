var path = require('path');
require('../../errors');
module.exports = {
    schema: [
        {path: path.join(__dirname, 'schema'), linkSP: true},
        {path: path.join(__dirname, 'schema/seeds')}
    ],
    'decision.lookup.response.receive': result => {
        if (result && Array.isArray(result.split)) {
            result.split.forEach(split => {
                if (split.analytics && Array.isArray(split.analytics.rows)) {
                    split.analytics = split.analytics.rows.reduce((prev, cur) => {
                        prev[cur.name] = cur.value;
                        return prev;
                    }, {});
                }
                return split;
            });
        }
        return result;
    }
};
