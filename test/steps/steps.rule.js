module.exports = function steps({version, callSite}) {
    if (!version || !version('10.51.0')) throw new Error('ut-rule requires ut-run >= 10.51.0');
    return {
        'steps.rule.rule.add': ({name, params}) => ({
            ...callSite?.(),
            method: 'rule.rule.add',
            name,
            params,
            result(result, assert) {
                assert.comment('conditionId: ' + result.condition[0].conditionId);
                assert.ok(result.condition[0].conditionId, 'return conditionId');
            }
        })
    };
};
