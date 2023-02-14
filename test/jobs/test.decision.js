/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        decision: function(test, bus, run, ports, {
            ruleDecisionSnapshot,
            userUtils: {pageSize}
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
                        this.countryName = result.country.find(
                            (country) => country.name === 'Slovenia'
                        );
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
                        this.regionName = result.items.find(
                            (region) => region.itemCode === 'Montana'
                        ).itemName;
                        this.regionId2 = result.items.find(
                            (region) => region.itemCode === 'Montana'
                        ).value;
                    }
                },
                {
                    name: 'fetch channels',
                    method: 'integration.vChannel.fetch',
                    params: {
                    },
                    result: function(result, assert) {
                        assert.ok(result.length > 0, 'return channels');
                        this.countryId = result[0].find(
                            (country) => country.countryId !== null
                        ).channelId;
                        this.regionId = result[0].find(
                            (region) => region.regionId !== null
                        ).channelId;
                        this.cityId = result[0].find(
                            (city) => city.cityId !== null
                        ).channelId;
                    }
                },
                {
                    name: 'fetch city',
                    method: 'core.itemName.fetch',
                    params: {
                        alias: ['city'],
                        isEnabled: 1
                    },
                    result: function(result, assert, {method, validation}) {
                        assert.ok(validation[`${method}.result`], `${method} validation passed`);
                        this.cityName = result.items.find(
                            (city) => city.itemCode === 'Sandanski'
                        ).itemName;
                        this.cityId2 = result.items.find(
                            (city) => city.itemCode === 'Sandanski'
                        ).value;
                    }
                },
                ruleDecisionSnapshot({name: 'No match'}),
                ruleDecisionSnapshot({name: 'Period', operationDate: '2022-01-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Period exact start date', operationDate: '2022-01-01T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Period exact end date', operationDate: '2022-02-01T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Period negative', operationDate: '2021-12-31T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Start date', operationDate: '2122-03-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Start date exact as in rule', operationDate: '2122-03-01T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'Start date negative', operationDate: '2122-02-28T23:59:59Z'}),
                ruleDecisionSnapshot({name: 'End date', operationDate: '2021-11-10T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'End date exact as in rule', operationDate: '2021-12-01T00:00:00Z'}),
                ruleDecisionSnapshot({name: 'End date negative', operationDate: '2021-12-01T00:00:01Z'}),
                ruleDecisionSnapshot({name: 'Operation', operation: 'Rule Deposit'}),
                ruleDecisionSnapshot({name: 'Channel country'}, ({countryId}) => ({channelId: countryId})),
                ruleDecisionSnapshot({name: 'Channel country negative'}, ({countryId}) => ({channelId: countryId + 10})),
                ruleDecisionSnapshot({name: 'Channel region'}, ({regionId}) => ({channelId: regionId})),
                ruleDecisionSnapshot({name: 'Channel region negative'}, ({regionId2}) => ({channelId: regionId2})),
                ruleDecisionSnapshot({name: 'Channel city'}, ({cityId}) => ({channelId: cityId})),
                ruleDecisionSnapshot({name: 'Channel city negative'}, ({cityId2}) => ({channelId: cityId2})),
                ruleDecisionSnapshot({name: 'Channel organization'}, ({Greenpeace: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Channel organization negative'}, ({Greenpeace: {organization: [{actorId: channelId}]}}) => ({channelId: channelId + 1})),
                ruleDecisionSnapshot({name: 'Channel organization tag'}, ({Mastercard: {organization: [{actorId: channelId}]}}) => ({channelId})),
                ruleDecisionSnapshot({name: 'Channel organization tag negative'}, ({Mastercard: {organization: [{actorId: channelId}]}}) => ({channelId: channelId + 1})),
                ruleDecisionSnapshot({name: 'Holder account', sourceAccount: 'source'}),
                ruleDecisionSnapshot({name: 'Holder account negative', sourceAccount: 'destination'}),
                ruleDecisionSnapshot({name: 'Holder country', sourceAccount: 'source-country'}),
                ruleDecisionSnapshot({name: 'Holder country negative'}, ({countryName}) => ({sourceAccount: countryName.toString()})),
                ruleDecisionSnapshot({name: 'Holder region', sourceAccount: 'source-region'}),
                ruleDecisionSnapshot({name: 'Holder region negative'}, ({regionName}) => ({sourceAccount: regionName.toString()})),
                ruleDecisionSnapshot({name: 'Holder city', sourceAccount: 'source-city'}),
                ruleDecisionSnapshot({name: 'Holder city negative'}, ({cityName}) => ({sourceAccount: cityName.toString()})),
                ruleDecisionSnapshot({name: 'Holder type', operation: 'Rule Withdraw'}),
                ruleDecisionSnapshot({name: 'Holder kyc', operation: 'Rule Cash In'}),
                ruleDecisionSnapshot({name: 'Holder organization', sourceAccount: 'source-organization'}),
                ruleDecisionSnapshot({name: 'Holder organization negative', sourceAccount: 'destination-organization'}),
                ruleDecisionSnapshot({name: 'Holder organization tag', sourceAccount: 'source-organization-tag'}),
                ruleDecisionSnapshot({name: 'Holder organization tag negative', sourceAccount: 'destination-organization-tag'}),
                ruleDecisionSnapshot({name: 'Counterparty account', destinationAccount: 'destination'}),
                ruleDecisionSnapshot({name: 'Counterparty account negative', destinationAccount: 'source'}),
                ruleDecisionSnapshot({name: 'Counterparty country', destinationAccount: 'destination-country'}),
                ruleDecisionSnapshot({name: 'Counterparty country negative'}, ({countryName}) => ({destinationAccount: countryName.toString()})),
                ruleDecisionSnapshot({name: 'Counterparty region', destinationAccount: 'destination-region'}),
                ruleDecisionSnapshot({name: 'Counterparty region negative'}, ({regionName}) => ({destinationAccount: regionName.toString()})),
                ruleDecisionSnapshot({name: 'Counterparty city', destinationAccount: 'destination-city'}),
                ruleDecisionSnapshot({name: 'Counterparty city negative'}, ({cityName}) => ({destinationAccount: cityName.toString()})),
                ruleDecisionSnapshot({name: 'Counterparty type', operation: 'Rule Transfer OTP'}),
                ruleDecisionSnapshot({name: 'Counterparty kyc', operation: 'Rule Topup'}),
                ruleDecisionSnapshot({name: 'Counterparty organization', destinationAccount: 'destination-organization'}),
                ruleDecisionSnapshot({name: 'Counterparty organization negative', destinationAccount: 'source-organization'}),
                ruleDecisionSnapshot({name: 'Counterparty organization tag', destinationAccount: 'destination-organization-tag'}),
                ruleDecisionSnapshot({name: 'Counterparty organization tag negative', destinationAccount: 'source-organization-tag'}),
                ruleDecisionSnapshot({name: 'Test limits within limit range with overridden amount and bgn, must match', operation: 'Rule Balance Enquiry', amount: '999', currency: 'BGN'}),
                ruleDecisionSnapshot({name: 'Test limits within limit range with overridden amount with default currency, must not match', operation: 'Rule Balance Enquiry', amount: '999'}),
                ruleDecisionSnapshot({name: 'Test limits within limit range with overridden amount with overridden currency, must not match', operation: 'Rule Balance Enquiry', amount: '999', currency: 'EUR'}),
                ruleDecisionSnapshot({name: 'Test limits with only operation, must not match', operation: 'Rule Balance Enquiry'}),
                ruleDecisionSnapshot({name: 'Test limits with only operation and BGN currency, must match', operation: 'Rule Balance Enquiry', currency: 'BGN'}),
                ruleDecisionSnapshot({name: 'Test limits with only operation and EUR currency, must not match', operation: 'Rule Balance Enquiry', currency: 'EUR'}),
                ruleDecisionSnapshot({name: 'Test limits when amount is below min but for another currency, must not match', operation: 'Rule Balance Enquiry', amount: '8'}),
                ruleDecisionSnapshot({name: 'Test limits when amount is above max but for another currency, must not match', operation: 'Rule Balance Enquiry', amount: '1001'}),
                ruleDecisionSnapshot({name: 'Test rule for assignments, must match', operation: 'Rule Wallet to Wallet'}),
                ruleDecisionSnapshot({name: 'Test rule for assignments, must not match', operation: 'Rule Wallet to Wallet', currency: 'BGN'}),
                ruleDecisionSnapshot({name: 'Test rule for split analytics', operation: 'Rule Billpayment'}),
                ruleDecisionSnapshot({name: 'Test rule for split analytics, must not match', operation: 'Rule Billpayment', currency: 'EUR'}),
                {
                    name: 'Test rule for limits daily above limit',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Ministatement',
                        amount: '2100',
                        currency: 'USD',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedDailyLimitAmount', 'Transaction amount is below minimum');
                    }
                },
                {
                    name: 'Test rule for limits weekly above limit',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Refund',
                        amount: '3100',
                        currency: 'USD',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMinLimitAmount', 'Limit exceeded');
                    }
                },
                {
                    name: 'Test rule for limits monthly above limit',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Request Money',
                        amount: '4100',
                        currency: 'USD',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMinLimitAmount', 'Transaction amount is below minimum');
                    }
                },
                {
                    name: 'Test rule with different limits - limit for min amount',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Balance Enquiry',
                        amount: '30',
                        currency: 'BGN',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMinLimitAmount', 'Transaction amount is below minimum');
                    }
                },
                {
                    name: 'Test rule for limits - limit for min amount - amount in range for one of the rules but out of the range for another',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Balance Enquiry',
                        amount: '10',
                        currency: 'BGN',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMinLimitAmount', 'Transaction amount is below minimum');
                    }
                },
                {
                    name: 'Test rule for limits above max amount',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Balance Enquiry',
                        amount: '1001',
                        currency: 'BGN',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMaxLimitAmount', 'Transaction amount is above maximum');
                    }
                },
                {
                    name: 'Test rule for limits below min amount',
                    method: 'rule.decision.lookup',
                    params: {
                        operation: 'Rule Ministatement',
                        amount: '8',
                        currency: 'BGN',
                        sourceAccount: 'current',
                        operationDate: '2022-02-10T00:00:00Z',
                        destinationAccount: 'current'
                    },
                    error: function(error, assert) {
                        assert.equal(error.type, 'rule.exceedMinLimitAmount', 'Transaction amount is below minimum');
                    }
                }
            ]);
        }
    };
};
