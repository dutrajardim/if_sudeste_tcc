import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getDynamoDBDocumentClient } from "./helpers.mjs";

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.PERSONAL_DATA_TABLE_NAME

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

  // setting query parameters
  let params = {
    TableName: tableName,
    IndexName: "SortDataIndex",
    KeyConditionExpression: "#SortKey = :v1",
    ExpressionAttributeNames: { "#SortKey": "SortKey" },
    ExpressionAttributeValues: { ":v1": "contact#telephones" }
  }

  // checking for pagination parameters
  if (event.queryStringParameters?.LastEvaluatedKey)
    params.ExclusiveStartKey = event.queryStringParameters.LastEvaluatedKey

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