require('ut-run').run({
    method: 'types',
    main: () => [[{
        main: require.resolve('./'),
        pkg: require.resolve('./package.json')
    }]],
    config: {
        utRule: true,
        utRun: {
            types: {
                dependencies: 'login,core,customer',
                validation: 'utRule.validation',
                error: 'utRule.error'
            }
        }
    }
});
