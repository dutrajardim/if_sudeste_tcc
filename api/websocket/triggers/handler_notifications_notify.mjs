import { QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { ApiGatewayManagementApi, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'


const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME
const endpoint = process.env.WEBSOCKET_ENDPOINT;

export const handler = async (event) => {

  const client = new ApiGatewayManagementApi({
    region: event.awsRegion,
    endpoint: `https://${endpoint}`
  })

  const connections = await ddbDocClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: "Channel",
    KeyConditionExpression: "#SortKey = :notifications",
    ExpressionAttributeNames: { "#SortKey": "SortKey" },
    ExpressionAttributeValues: { ":notifications": "notifications" }
  }))

  console.log("DB ScanCommand answer:", connections)

  const notifications = event.Records
    .filter(({ eventName }) => ["INSERT", "MODIFY"].includes(eventName))
    .map(({ dynamodb }) => unmarshall(dynamodb.NewImage))

  console.log("Notifications:", notifications)

  if (notifications.length > 0) {
    await Promise.all(connections.Items.map(async ({ PartitionKey }) => {
      try {
        await client.send(new PostToConnectionCommand({
          ConnectionId: PartitionKey,
          Data: JSON.stringify(notifications)
        }))
      }
      catch (e) {
        if (e["$metadata"]?.httpStatusCode === 410) {
          ddbDocClient.send(new DeleteCommand({
            TableName: tableName,
            Key: {
              PartitionKey,
              SortKey: "notifications"
            }
          }))
        }
        else throw e
      }
    }))
  }
}