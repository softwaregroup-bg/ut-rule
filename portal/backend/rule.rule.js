/** @type { import("../../handlers").libFactory } */
export default () => ({
    async 'rule.rule.fetch.response.receive'(response, $meta) {
        function get(list, factor, type, key) {
            return list.filter(item => item.factor === factor && item.type === type).map(item => Number(item[key]));
        }
        if (response?.payload?.jsonrpc) response = await super.receive(response, $meta);
        response.operation = {
            type: get(response.conditionItem, 'oc', 'operation', 'itemNameId')
        };
        response.channel = {
            country: get(response.conditionItem, 'cs', 'country', 'itemNameId'),
            region: get(response.conditionItem, 'cs', 'region', 'itemNameId'),
            city: get(response.conditionItem, 'cs', 'city', 'itemNameId')
        };
        response.source = {
            customer: get(response.conditionActor, 'so', 'organization', 'actorId'),
            cardProduct: get(response.conditionItem, 'sc', 'cardProduct', 'itemNameId'),
            accountProduct: get(response.conditionItem, 'sc', 'accountProduct', 'itemNameId'),
            country: get(response.conditionItem, 'ss', 'country', 'itemNameId'),
            region: get(response.conditionItem, 'ss', 'region', 'itemNameId'),
            city: get(response.conditionItem, 'ss', 'city', 'itemNameId')
        };
        response.destination = {
            customer: get(response.conditionActor, 'do', 'organization', 'actorId'),
            cardProduct: get(response.conditionItem, 'dc', 'cardProduct', 'itemNameId'),
            accountProduct: get(response.conditionItem, 'dc', 'accountProduct', 'itemNameId'),
            country: get(response.conditionItem, 'ds', 'country', 'itemNameId'),
            region: get(response.conditionItem, 'ds', 'region', 'itemNameId'),
            city: get(response.conditionItem, 'ds', 'city', 'itemNameId')
        };
        return response;
    },
    'rule.account.get.request.send'({accountId}, $meta) {
        return super.send({accountIdList: [accountId]}, $meta);
    },
    'rule.account.add.request.send'({account, balance, currencyName, ...params}, $meta) {
        return super.send({...params, account: [account]}, $meta);
    },
    'rule.account.edit.request.send'({account: {balance, currencyName, ...account}}, $meta) {
        return super.send({account}, $meta);
    }
});
