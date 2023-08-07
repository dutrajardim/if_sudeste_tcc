
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'

const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME

export const handler = async (event) => {

  const { channel } = event.queryStringParameters ?? {}

  if (!channel)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Missing channel parameter!' })
    }

  let params = {
    TableName: tableName,
    Item: {
      PartitionKey: event.requestContext.connectionId,
      SortKey: channel,
      TTL: parseInt((Date.now() / 1000) + 3600)
    }
  }

  const data = await ddbDocClient.send(new PutCommand(params));
  console.log("DB PutCommand answer:", data);

  const response = {
    statusCode: 200,
    body: 'Connected.'
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.requestContext.routeKey} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}