const test = {
    sqlStandard: true
};

const utc = {
    'any.required': `
    Configuration value utRule.sql.utc=true is required.
    Check the release notes in /ut-rule/doc/release-v12.md
    before adding it to your configuration.
`
};

module.exports = () => ({
    // environments
    dev: {
        sqlStandard: true
    },
    test,
    jenkins: test,
    uat: {
        sqlStandard: true
    },
    // methods
    kustomize: {
        adapter: true,
        orchestrator: true,
        gateway: true
    },
    types: {
        sql: {
            utc: true
        },
        gateway: true
    },
    doc: {
        gateway: true
    },
    // test types
    unit: {
        sql: {
            utc: true
        },
        adapter: true,
        orchestrator: true,
        gateway: true,
        test: true
    },
    integration: {
        adapter: true,
        orchestrator: true,
        gateway: true,
        test: true
    },
    db: {
        adapter: true
    },
    validation: ({joi}) => joi.object({
        adapter: joi.boolean(),
        orchestrator: joi.boolean(),
        gateway: joi.boolean(),
        test: joi.boolean(),
        sql: joi.object({
            utc: joi.valid(true).required().messages(utc),
            exclude: joi.any(),
            clearing: joi.boolean()
        }).required().messages(utc),
        sqlTest: joi.boolean(), // unused config to be removed in next major version
        sqlSeed: [
            joi.boolean(),
            joi.object({
                exclude: joi.any()
            })
        ],
        sqlStandard: [
            joi.boolean(),
            joi.object({
                exclude: joi.any()
            })
        ],
        ruleDispatch: [
            joi.boolean(),
            joi.object()
        ]
    })
});
