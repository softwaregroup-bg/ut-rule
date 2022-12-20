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
                {
                    name: 'fetch countries',
                    method: 'core.country.fetch',
                    params: {},
                    result: function(result, assert, {method, validation}) {
                        assert.ok(validation[`${method}.result`], `${method} validation passed`);
                        assert.ok(result.country, 'return fetchCountry');
                        this.countryId = result.country.find(
                            (country) => country.name === 'United Arab Emirates'
                        ).countryId;
                    }
                },
                {
                    name: 'fetch region',
                    method: 'core.itemName.fetch',
                    params: {
                        alias: ['region'],
                        isEnabled: 1
                    },
                    result: function(result, assert, {method, validation}) {
                        assert.ok(validation[`${method}.result`], `${method} validation passed`);
                        this.regionId = result.items.find(
                            (region) => region.itemCode === 'Varna'
                        ).value;
                    }
                },
                {
                    name: 'fetch city',
                    method: 'core.itemNameByItemType.fetch',
                    params: {itemType: 'city'},
                    result: function(result, assert, {method, validation}) {
                        assert.ok(validation[`${method}.result`], `${method} validation passed`);
                        this.cityId = result.itemNameByType.find(
                            (city) => city.itemNameTranslation === 'Aitos'
                        ).itemNameId;
                    }
                },
                ruleDecisionSnapshot({name: 'No match'}),
                ruleDecisionSnapshot({name: 'Period', operationDate: '2022-01-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Start date', operationDate: '2122-03-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'End date', operationDate: '2021-11-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Operation', operation: 'Rule Deposit'}),
                // ruleDecisionSnapshot({name: 'Operation tag', tag: 'cash'}),
                ruleDecisionSnapshot({name: 'Channel country'}, ({countryId}) => ({channelId: countryId})),
                ruleDecisionSnapshot({name: 'Channel region'}, ({regionId}) => ({channelId: regionId})),
                ruleDecisionSnapshot({name: 'Channel city'}, ({cityId}) => ({channelId: cityId})),
                ruleDecisionSnapshot({name: 'Channel organization'}, ({Greenpeace: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Channel organization tag'}, ({Mastercard: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Holder account', sourceAccount: 'source'}),
                ruleDecisionSnapshot({name: 'Holder country', sourceAccount: 'source-country'}),
                ruleDecisionSnapshot({name: 'Holder region', sourceAccount: 'source-region'}),
                ruleDecisionSnapshot({name: 'Holder city', sourceAccount: 'source-city'}),
                ruleDecisionSnapshot({name: 'Holder type', holderCustomerType: 'corporate'}),
                ruleDecisionSnapshot({name: 'Holder kyc', holderKyc: 'Level 2 - Individual - Bulgaria', operation: 'Rule Withdraw'}),
                ruleDecisionSnapshot({name: 'Holder organization', sourceAccount: 'source-organization'}),
                ruleDecisionSnapshot({name: 'Holder organization tag', sourceAccount: 'source-organization-tag'}),
                ruleDecisionSnapshot({name: 'Counterparty account', destinationAccount: 'destination'}),
                ruleDecisionSnapshot({name: 'Counterparty country', destinationAccount: 'destination-country'}),
                ruleDecisionSnapshot({name: 'Counterparty region', destinationAccount: 'destination-region'}),
                ruleDecisionSnapshot({name: 'Counterparty city', destinationAccount: 'destination-city'}),
                ruleDecisionSnapshot({name: 'Counterparty type', counterpartyCustomerType: 'corporate'}),
                ruleDecisionSnapshot({name: 'Counterparty kyc', counterpartyKyc: 'Level 0 - Individual - Bulgaria', operation: 'Rule Withdraw'}),
                ruleDecisionSnapshot({name: 'Counterparty organization', destinationAccount: 'destination-organization'}),
                ruleDecisionSnapshot({name: 'Counterparty organization tag', destinationAccount: 'destination-organization-tag'})
            ]);
        }
    };
};
