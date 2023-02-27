const path = require('path');

module.exports = function sql({config}) {
    return {
        namespace: 'db/rule',
        schema: [{
            path: path.join(__dirname, 'schema'),
            linkSP: true,
            config
        }],
        'rule.decision.lookup.request.send': params => params.transferProperties ? ({
            ...params,
            transferProperties: Object.fromEntries(params.transferProperties).map(
                ([name, value]) => ({name, value, factor: 'tp'})
            )
        }) : params,
        'rule.decision.lookup.response.receive': result => {
            if (result && Array.isArray(result.split)) {
                result.split.forEach(split => {
                    if (split.analytics && Array.isArray(split.analytics.rows)) {
                        split.analytics = split.analytics.rows.reduce((prev, cur) => {
                            prev[cur.name] = cur.value;
                            return prev;
                        }, {});
                    } else if (split.analytics && split.analytics.rows && split.analytics.rows.name && split.analytics.rows.value) {
                        const analytics = {};
                        analytics[split.analytics.rows.name] = split.analytics.rows.value;
                        split.analytics = analytics;
                    }
                    return split;
                });
            }
            return result;
        }
    };
};
