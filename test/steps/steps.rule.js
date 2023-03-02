/** @type { import("../../handlers").steps } */
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
        }),
        'steps.rule.condition.fetch': ({name, params}) => ({
            ...callSite?.(),
            method: 'rule.condition.fetch',
            name,
            params,
            result(result, assert) {
                assert.comment('conditionId: ' + result.condition[0].conditionId);
                assert.ok(result.condition[0].conditionId, 'return conditionId');
            }
        }),
        'steps.rule.condition.get': ({name, params}) => ({
            ...callSite?.(),
            method: 'rule.condition.get',
            name,
            params,
            result(result, assert) {
                assert.comment('conditionId: ' + result.condition[0].conditionId);
                assert.ok(result.condition[0].conditionId, 'return conditionId');
            }
        }),
        'steps.rule.decision.snapshot': ({name, ...params}, callback) => ({
            ...callSite?.(),
            method: 'rule.decision.lookup',
            name,
            params(context) {
                return {
                    operation: 'Rule Withdraw',
                    operationDate: '2022-02-10T00:00:00Z',
                    amount: '1000',
                    currency: 'USD',
                    sourceAccount: 'current',
                    destinationAccount: 'current',
                    ...params,
                    ...callback?.(context)
                };
            },
            result(result, assert) {
                assert.comment('conditionId: ' + result.split?.[0]?.conditionId);
                delete result?.amount?.transferTypeId;
                delete result?.amount?.accountRateId;
                delete result?.amount?.settlementRateId;
                result.split?.forEach(split => {
                    delete split?.conditionId;
                    delete split?.splitNameId;
                });
                assert.matchSnapshot(result, 'decision');
            }
        })
    };
};
