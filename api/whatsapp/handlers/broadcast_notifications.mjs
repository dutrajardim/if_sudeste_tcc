import { ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { ApiGatewayManagementApi, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'


const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME
const endpoint = process.env.WEBSOCKET_ENDPOINT;

export const handler = async (event) => {
    console.info('received:', event)

    const client = new ApiGatewayManagementApi({
        region: event.awsRegion,
        endpoint: `https://${endpoint}`
    })

    const connections = await ddbDocClient.send(new ScanCommand({
        TableName: tableName,
        ProjectionExpression: 'Id'
    }))

    console.log("DB ScanCommand answer:", connections)

    const notifications = event.Records
        .filter(({ eventName }) => eventName === "INSERT")
        .map(({ dynamodb }) => unmarshall(dynamodb.NewImage))

    console.log("Notifications:", notifications)

    if (notifications.length > 0) {
        await Promise.all(connections.Items.map(async ({ Id }) => {
            try {
                await client.send(new PostToConnectionCommand({
                    ConnectionId: Id,
                    Data: JSON.stringify(notifications)
                }))
            }
            catch (e) {
                if (e["$metadata"]?.httpStatusCode === 410) {
                    ddbDocClient.send(new DeleteCommand({
                        TableName: tableName,
                        Key: { Id }
                    }))
                }
                else throw e
            }
        }))
    }
}