module.exports = {
    fetch: filter => ({
        filterBy,
        orderBy,
        paging
    }) => filter({
        account: filterBy,
        orderBy,
        paging
    }),
    get: find => params => find({accountId: params.payload.params.accountIdList[0]}).then(account => ({account})),
    objects: [

    ]
};
