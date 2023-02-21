module.exports = {
    name: 'pogpool-pipeline',
    stages: [
        {
            name: 'Source',
            actions: [
                {
                    type: 'SOURCE',
                    name: 'GithubRepo',
                    repo: 'pogpool',
                    owner: 'starco-org'
                }
            ]
        },
        {
            name: 'Staging',
            actions: [
                {
                    type: 'BUILD',
                    name: 'DeployInfra',
                    script: '/deploy-infra.yml',

                    // Note: rise-pipeline doesnt support replacing these with
                    // ssm params yet. So this stage will fail for now
                    env: {
                        AWS_KEY: '{@ssm.STAGING_AWS_KEY}',
                        AWS_SECRET: '{@ssm.STAGING_AWS_SECRET}'
                    }
                }
            ]
        }
    ]
}
