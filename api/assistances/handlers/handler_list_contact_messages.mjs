import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDBDocumentClient } from "./helpers.mjs";

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.ASSISTANCES_TABLE_NAME

/**
 * THis lambda function is responsible for returning messages from a contact
 */
export const handler = async (event) => {
  // writing to cloudwatch
  console.info('received:', event)

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Credentials": true,
  }

  const { partitionKey } = event.pathParameters

  if (!partitionKey)
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'missing partitionKey' })
    }

  // setting query parameters
  let params = {
    TableName: tableName,
    KeyConditionExpression: "#PartitionKey = :v1",
    ExpressionAttributeNames: { "#PartitionKey": "PartitionKey" },
    ExpressionAttributeValues: { ":v1": partitionKey }
  }

  // checking for pagination parameters
  if (event.queryStringParameters?.SortKey)
    params.ExclusiveStartKey = {
      PartitionKey: partitionKey,
      SortKey: event.queryStringParameters.SortKey
    }

  // looking for messages
  const { "$metadata": metadata, Items, LastEvaluatedKey } = await docClient.send(new QueryCommand(params))

  // writing to cloudwatch
  console.info('metadata:', metadata)

  // returning messages
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ Items, LastEvaluatedKey })
  }
}