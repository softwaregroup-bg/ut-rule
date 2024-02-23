/** @type { import("../../handlers").test } */
module.exports = function test() {
    return {
        // rule: function(test, bus, run, ports, {
        //     ruleRuleAdd,
        //     ruleConditionGet,
        //     ruleConditionFetch,
        //     customerOrganizationApprove,
        //     customerOrganizationGetByDepth,
        //     coreUtils: {generateRandomNumber},
        //     userUtils: {adminFirstName},
        //     customerUtils: {getByDepthOrganization, orgName},
        //     ruleUtils: {sourceAccountNumber, destinationAccountNumber}
        // }) {
        //     const ruleName = 'autoRule' + generateRandomNumber();
        //     let organizationDepthArray;
        //     return run(test, bus, [
        //         'Generate admin user',
        //         'Login admin user',
        //         {
        //             name: 'get admin details',
        //             method: 'user.user.get',
        //             params: ({login: {'identity.check': {actorId}}}) => {
        //                 return {
        //                     actorId
        //                 };
        //             },
        //             result: function(result, assert, {method, validation}) {
        //                 assert.ok(validation[`${method}.result`], `${method} validation passed`);
        //                 assert.equal(result.person.firstName, adminFirstName, 'return person');
        //                 this.businessUnitId = result.memberOF[0].object;
        //             }
        //         },
        //         {
        //             name: 'fetch child organizations of sa organization',
        //             method: 'customer.organization.graphFetch',
        //             params: ({'get admin details': {memberOF: [{object}]}}) => ({parentFilter: object}),
        //             result: (result, assert, {method, validation}) => {
        //                 assert.ok(validation[`${method}.result`], `${method} validation passed`);
        //                 assert.ok(result.organization, 'return organization graph fetch details');
        //             }
        //         },
        //         {
        //             name: 'fetch defaultBu setting',
        //             method: 'core.configuration.fetch',
        //             params: {key: getByDepthOrganization},
        //             result: function(result, assert, {method, validation}) {
        //                 assert.ok(validation[`${method}.result`], `${method} validation passed`);
        //                 const orgDepth = result[0][0].value;
        //                 organizationDepthArray = (new Array(orgDepth - 1)).fill(0).map((v, k) => k); // result like: [0, 1, 2, 3, 4] if orgDepth = 6
        //                 assert.ok(typeof result, 'object', 'return result');
        //             }
        //         },
        //         customerOrganizationGetByDepth({
        //             name: 'get organizations by depth',
        //             params: () => ({key: getByDepthOrganization})
        //         }),
        //         // Create organization which correspond to the kyc's depth
        //         {
        //             name: 'Create organization by depth',
        //             steps: () => organizationDepthArray.map(org => ({
        //                 name: 'Add and approve organizations',
        //                 steps: () => [
        //                     {
        //                         name: 'add organization',
        //                         method: 'customer.organization.add',
        //                         params: ({
        //                             businessUnitId
        //                         }) => ({
        //                             organization: {
        //                                 organizationName: orgName
        //                             },
        //                             parent: [businessUnitId]
        //                         }),
        //                         result: function(result, assert, {method, validation}) {
        //                             assert.ok(validation[`${method}.result`], `${method} validation passed`);
        //                             this.businessUnitId = result['organization.info'][0].actorId;
        //                             assert.comment('actorId: ' + result['organization.info'][0].actorId);
        //                         }
        //                     },
        //                     customerOrganizationApprove({
        //                         name: 'approve organization',
        //                         params: ({
        //                             businessUnitId
        //                         }) => ({actorId: businessUnitId})
        //                     })
        //                 ]
        //             }))
        //         },
        //         ruleConditionFetch({
        //             params: {
        //                 name: 'Test Split Range'
        //             }
        //         }),
        //         {
        //             name: 'list dropdowns for rule add',
        //             method: 'rule.dropdown.list',
        //             params: {},
        //             result: function(result, assert, {method, validation}) {
        //                 assert.ok(validation[`${method}.result`], `${method} validation passed`);
        //                 assert.ok(result['rule.operation'].length > 0, 'return rule operation as array with length > 0');
        //             }
        //         },
        //         {
        //             name: 'fetch channels',
        //             method: 'integration.vChannel.fetch',
        //             params: {
        //             },
        //             result: function(result, assert) {
        //                 assert.ok(result.length > 0, 'return channels');
        //                 this.countryId = result[0].find(
        //                     (country) => country.countryId !== null
        //                 ).channelId;
        //                 this.regionId = result[0].find(
        //                     (region) => region.regionId !== null
        //                 ).channelId;
        //                 this.cityId = result[0].find(
        //                     (city) => city.cityId !== null
        //                 ).channelId;
        //             }
        //         },
        //         ruleRuleAdd({
        //             name: 'rule1',
        //             params: {
        //                 condition: {
        //                     name: 'Rule ' + Date.now(),
        //                     operationEndDate: '2020-01-01T00:00:00.000Z',
        //                     priority: 122300
        //                 }
        //             }
        //         }),
        //         ruleConditionGet({
        //             name: 'get Rule 1',
        //             params: ({rule1: {condition: [{conditionId}]}}) => ({conditionId})
        //         }),
        //         // same priority different name
        //         ruleRuleAdd({
        //             name: 'rule 2',
        //             params: {
        //                 condition: {
        //                     name: ruleName,
        //                     operationEndDate: '2020-01-01T00:00:00.000Z',
        //                     priority: 122300
        //                 }
        //             }
        //         }),
        //         ruleConditionGet({
        //             name: 'get Rule 2',
        //             params: ({'rule 2': {condition: [{conditionId}]}}) => ({conditionId})
        //         }),
        //         ruleConditionFetch({
        //             name: 'fetch rule 2',
        //             params: {
        //                 name: ruleName
        //             }
        //         }),
        //         {
        //             name: 'rule 2 to be duplicated - expected error',
        //             method: 'rule.rule.add',
        //             params: {
        //                 condition: {
        //                     name: ruleName,
        //                     priority: 145600
        //                 }
        //             },
        //             error: function(error, assert) {
        //                 assert.equal(error.type, 'rule.duplicatedName', 'Rule with this name already exists');
        //             }
        //         },
        //         {
        //             name: 'rule 2 to be duplicated but created in another BU - expected error',
        //             method: 'rule.rule.add',
        //             params: ({businessUnitId}) => ({
        //                 condition: {
        //                     name: ruleName,
        //                     priority: 145600
        //                 },
        //                 conditionActor: [{
        //                     actorId: businessUnitId
        //                 }]
        //             }),
        //             error: function(error, assert) {
        //                 assert.equal(error.type, 'rule.duplicatedName', 'Rule with this name already exists');
        //             }
        //         },
        //         ruleRuleAdd({
        //             name: 'rule 3 success general fields',
        //             params: ({
        //                 'list dropdowns for rule add': {
        //                     'rule.operation': [{value}],
        //                     'rule.accountProduct': [{value: accountProductValue}],
        //                     'rule.kyc': [{value: kycValue}],
        //                     'rule.customerType': [, {value: customerTypeValue}],
        //                     'rule.cardProduct': [{value: cardProductValue}]
        //                 },
        //                 'get admin details': {memberOF: [{object}]},
        //                 countryId, cityId, regionId
        //             }) => ({
        //                 condition: {
        //                     name: ruleName + 3,
        //                     priority: 565660,
        //                     operationStartDate: '2123-01-30T22:00:00.000Z'
        //                 },
        //                 channel: {
        //                     country: countryId,
        //                     region: regionId,
        //                     city: cityId,
        //                     actor: object
        //                 },
        //                 operation: {
        //                     type: [value]
        //                 },
        //                 source: {
        //                     country: countryId,
        //                     region: regionId,
        //                     city: cityId,
        //                     actor: object,
        //                     customerType: customerTypeValue,
        //                     cardProduct: cardProductValue,
        //                     accountProduct: accountProductValue,
        //                     kyc: kycValue
        //                 },
        //                 destination: {
        //                     country: countryId,
        //                     region: regionId,
        //                     city: cityId,
        //                     actor: object,
        //                     cardProduct: cardProductValue,
        //                     customerType: customerTypeValue,
        //                     accountProduct: accountProductValue,
        //                     kyc: kycValue
        //                 }
        //             })
        //         }),
        //         ruleConditionGet({
        //             name: 'get Rule 3',
        //             params: ({'rule 3 success general fields': {condition: [{conditionId}]}}) => ({conditionId})
        //         }),
        //         ruleRuleAdd({
        //             name: 'rule 4 success with limits',
        //             params: ({
        //                 'list dropdowns for rule add': {
        //                     'rule.operation': [, {value}],
        //                     'rule.currency': [, , {value: currencyValue}]
        //                 },
        //                 'get admin details': {memberOF: [{object}]},
        //                 countryId, cityId, regionId
        //             }) => ({
        //                 condition: {
        //                     name: ruleName + 4,
        //                     priority: 516560,
        //                     operationStartDate: '2123-01-30T22:00:00.000Z'
        //                 },
        //                 channel: {
        //                     country: countryId,
        //                     region: regionId,
        //                     city: cityId,
        //                     actor: object
        //                 },
        //                 operation: {
        //                     type: [value]
        //                 },
        //                 limit: [{
        //                     currency: currencyValue,
        //                     minAmount: 10,
        //                     maxAmount: 10000,
        //                     priority: 4
        //                 }]
        //             })
        //         }),
        //         ruleConditionGet({
        //             name: 'get rule 4',
        //             params: ({'rule 4 success with limits': {condition: [{conditionId}]}}) => ({conditionId})
        //         }),
        //         ruleRuleAdd({
        //             name: 'rule 5 success with assignment',
        //             params: ({
        //                 'list dropdowns for rule add': {
        //                     'rule.operation': [, {value}],
        //                     'rule.currency': [, , {value: currencyValue}]
        //                 },
        //                 'get admin details': {memberOF: [{object}]},
        //                 countryId, cityId, regionId
        //             }) => ({
        //                 condition: {
        //                     name: ruleName + 5,
        //                     priority: 5656560,
        //                     operationStartDate: '2123-01-30T22:00:00.000Z'
        //                 },
        //                 channel: {
        //                     country: countryId,
        //                     region: regionId,
        //                     city: cityId,
        //                     actor: object
        //                 },
        //                 operation: {
        //                     type: [value]
        //                 },
        //                 splitName: [{
        //                     splitNameId: -1,
        //                     name: 'Realtime'
        //                 }],
        //                 splitRange: [{
        //                     splitNameId: -1,
        //                     splitRangeId: -1,
        //                     startAmountCurrency: currencyValue,
        //                     startAmount: 0
        //                 }],
        //                 splitAssignment: [{
        //                     splitNameId: -1,
        //                     splitAssignmentId: -2,
        //                     description: 'split for assignment',
        //                     debit: sourceAccountNumber,
        //                     credit: destinationAccountNumber,
        //                     percent: 100,
        //                     minValue: 0,
        //                     maxValue: 1000000
        //                 }]
        //             })
        //         }),
        //         ruleConditionGet({
        //             name: 'get Rule 5',
        //             params: ({'rule 5 success with assignment': {condition: [{conditionId}]}}) => ({conditionId})
        //         })
        //     ]);
        // }
    };
};
