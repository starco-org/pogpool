import { getFormattedNhlStats } from './getFormattedNhlStats.mjs'

export const config = {
    url: 'GET /stats',
    env: {
        TABLE: '{@output.pogpool-backend-infradev.TableName}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:BatchWriteItem'],
            Resource: '{@output.pogpool-backend-infradev.TableArn}'
        }
    ]
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
    await batchWrite(data)

    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true
        })
    }
}
