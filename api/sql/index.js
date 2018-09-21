const path = require('path');
const errorFactory = require('../../errors');

module.exports = {
    schema: [
        {path: path.join(__dirname, 'schema'), linkSP: true},
        {path: path.join(__dirname, 'schema/seeds')}
    ],
    start: function() {
        errorFactory(this.bus.errors); // initialize errors
    },
    'decision.lookup.response.receive': result => {
        if (result && Array.isArray(result.split)) {
            result.split.forEach(split => {
                if (split.analytics && Array.isArray(split.analytics.rows)) {
                    split.analytics = split.analytics.rows.reduce((prev, cur) => {
                        prev[cur.name] = cur.value;
                        return prev;
                    }, {});
                } else if (split.analytics && split.analytics.rows && split.analytics.rows.name && split.analytics.rows.value) {
                    var analytics = {};
                    analytics[split.analytics.rows.name] = split.analytics.rows.value;
                    split.analytics = analytics;
                }
                return split;
            });
        }
        return result;
    }
};
