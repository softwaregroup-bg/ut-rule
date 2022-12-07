require('ut-portal-admin/entry')({
    modules: [
        require('ut-core/portal').default,
        require('../portal').default
    ],
    utCore: true,
    utRule: true,
    portal: {
        test: {
            menu: [
                'rule.condition.browse'
            ]
        }
    }
});
