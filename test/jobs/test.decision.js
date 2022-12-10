/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        decision: function(test, bus, run, ports, {
            ruleDecisionSnapshot
        }) {
            return run(test, bus, [
                'Generate admin user',
                'Login admin user',
                {
                    name: 'Greenpeace',
                    method: 'customer.organization.fetch',
                    params: {searchString: 'Greenpeace'},
                    result: (result, assert) => {
                        assert.ok(result.organization[0].actorId, 'Greenpeace exists');
                    }
                },
                {
                    name: 'Mastercard',
                    method: 'customer.organization.fetch',
                    params: {searchString: 'Mastercard'},
                    result: (result, assert) => {
                        assert.ok(result.organization[0].actorId, 'Mastercard exists');
                    }
                },
                ruleDecisionSnapshot({name: 'No match'}),
                ruleDecisionSnapshot({name: 'Period', operationDate: '2022-01-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Start date', operationDate: '2022-03-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'End date', operationDate: '2021-11-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Operation', operation: 'Rule Deposit'}),
                ruleDecisionSnapshot({name: 'Channel country', channelId: 2}),
                ruleDecisionSnapshot({name: 'Channel region', channelId: 3}),
                ruleDecisionSnapshot({name: 'Channel city', channelId: 4}),
                ruleDecisionSnapshot({name: 'Channel organization'}, ({Greenpeace: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Channel organization tag'}, ({Mastercard: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Holder account', sourceAccount: 'source'}),
                ruleDecisionSnapshot({name: 'Holder country', sourceAccount: 'source-country'}),
                ruleDecisionSnapshot({name: 'Holder region', sourceAccount: 'source-region'}),
                ruleDecisionSnapshot({name: 'Holder city', sourceAccount: 'source-city'}),
                ruleDecisionSnapshot({name: 'Holder organization', sourceAccount: 'source-organization'}),
                ruleDecisionSnapshot({name: 'Holder organization tag', sourceAccount: 'source-organization-tag'}),
                ruleDecisionSnapshot({name: 'Counterparty account', destinationAccount: 'destination'}),
                ruleDecisionSnapshot({name: 'Counterparty country', destinationAccount: 'destination-country'}),
                ruleDecisionSnapshot({name: 'Counterparty region', destinationAccount: 'destination-region'}),
                ruleDecisionSnapshot({name: 'Counterparty city', destinationAccount: 'destination-city'}),
                ruleDecisionSnapshot({name: 'Counterparty organization', destinationAccount: 'destination-organization'}),
                ruleDecisionSnapshot({name: 'Counterparty organization tag', destinationAccount: 'destination-organization-tag'})
            ]);
        }
    };
};
