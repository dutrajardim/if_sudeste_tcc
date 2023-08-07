import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDBDocumentClient } from "./helpers.mjs";

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.NOTIFICATIONS_TABLE_NAME

/**
 * THis lambda function is responsible for returning messages from a contact
 */
export const handler = async (event) => {

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*,http://*",
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


  let keyConditions = ["#PartitionKey = :partitionKey"]
  let ExpressionAttributeNames = { "#PartitionKey": "PartitionKey" }
  let ExpressionAttributeValues = { ":partitionKey": partitionKey }

  const { from } = event.queryStringParameters ?? {}

  if (from) {
    keyConditions.push("#Timestamp > :from")
    ExpressionAttributeNames = { ...ExpressionAttributeNames, "#Timestamp": "Timestamp" }
    ExpressionAttributeValues = { ...ExpressionAttributeValues, ":from": parseInt(from, 10) }
  }

  const params = {
    TableName: tableName,
    IndexName: "Timestamp",
    KeyConditionExpression: keyConditions.join(" and "),
    ExpressionAttributeNames,
    ExpressionAttributeValues
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