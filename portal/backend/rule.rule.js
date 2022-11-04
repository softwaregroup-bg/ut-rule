/** @type { import("../../handlers").libFactory } */
export default () => ({
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
