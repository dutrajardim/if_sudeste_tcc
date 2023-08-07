
import { DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'

const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME

export const handler = async (event) => {

  const connections = await ddbDocClient.send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "#PartitionKey = :connection",
    ExpressionAttributeNames: { "#PartitionKey": "PartitionKey" },
    ExpressionAttributeValues: { ":connection": event.requestContext.connectionId }
  }))

  if (connections.Items.length > 0) {
    await Promise.all(connections.Items.map(async ({ PartitionKey, SortKey }) => {

      await ddbDocClient.send(new DeleteCommand({
        TableName: tableName,
        Key: { PartitionKey, SortKey }
      }))

    }))
  }

  const response = {
    statusCode: 200,
    body: 'Disconnected.'
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.requestContext.routeKey} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}