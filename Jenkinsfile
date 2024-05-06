library identifier: 'jenkinsfile@gallium', retriever: modernSCM([
    $class: 'GitSCMSource',
    remote: 'https://github.com/softwaregroup-bg/jenkinsfile.git'
])

ut (
    buildImage: 'nexus-dev.softwaregroup.com:5000/softwaregroup/ut-gallium',
    sonarCoverageExclusions: [
        'ui/**/*',
        'portal/**/*',
        'browser/**/*',
        'system/**/*',
        'model/*',
        'browser.js',
        'build.js',
        'playwright.config.js',
        'utWebpack.js',
        'utHelp.js'
    ].join(',')
)
