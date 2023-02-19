export const config = {
    url: 'GET /stats',
    env: {
        TABLE: '{@output.pogpool-infra.table}'
    },
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:BatchWriteItem'],
            Resource: '{@output.pogpool-infra.table_arn}'
        }
    ]
}

const batchWrite = async (table, items) => {
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
    return {
        statusCode: 200,
        body: JSON.stringify({
            ok: true
        })
    }
}
