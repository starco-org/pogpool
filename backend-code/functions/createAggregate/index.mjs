import { initState } from './initState/index.mjs'
import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})

export const config = {
    env: {
        TABLE: '{@output.pogpool-backend-infrastaging.TableName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:Scan'],
            Resource: [
                '{@output.pogpool-backend-infrastaging.TableArn}',
                '{@output.pogpool-backend-infrastaging.TableArn}/*'
            ]
        }
    ]
}

async function scanTable() {
    const params = {
        TableName: config.env.TABLE
    }

    const result = await dynamodb.scan(params).promise()
    return result.Items
}

export const handler = async () => {
    const items = await scanTable()
    const state = initState()
    const itemsExample = JSON.stringify(items, null, 2)
    console.log(itemsExample)
    return itemsExample
}
