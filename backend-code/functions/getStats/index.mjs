import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js'
import { getFormattedNhlStats } from './getFormattedNhlStats.mjs'
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})

export const config = {
    url: 'GET /stats',
    env: {
        TABLE: '{@output.pogpool-backend-infrastaging.TableName}',
        NODE_OPTIONS: '--experimental-fetch'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:BatchWriteItem'],
            Resource: '{@output.pogpool-backend-infrastaging.TableArn}'
        }
    ]
}

function batchIn25(array) {
    const batches = []
    let i = 0
    while (i < array.length) {
        batches.push(array.slice(i, i + 25))
        i += 25
    }
    return batches
}

async function batchWrite(items) {
    const table = process.env.TABLE
    const params = {
        RequestItems: {
            [table]: items.map((item) => ({
                PutRequest: {
                    Item: item
                }
            }))
        }
    }

    return dynamodb.batchWrite(params).promise()
}

export const handler = async () => {
    const data = await getFormattedNhlStats()
    const batches = batchIn25(data)

    for (const batch of batches) {
        await batchWrite(batch)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true,
            status: `Recorded ${
                data.length
            } records into stats db for ${new Date().toDateString()}`
        })
    }
}
