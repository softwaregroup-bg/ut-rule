module.exports = {
    implementation: 'rule',
    adapter: true,
    utPort: {
        noRecursion: true
    },
    utBus: {
        serviceBus: {
            requireMeta: true
        }
    },
    utCache: {
        adapter: true
    },
    utPortal: true,
    utBrowser: true,
    utLogin: true,
    utRule: {
        utc: true
    },
    utCore: true,
    utCustomer: true,
    utDocument: true,
    utUser: true
};
