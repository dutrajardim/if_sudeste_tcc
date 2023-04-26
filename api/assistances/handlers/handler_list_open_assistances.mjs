import { QueryCommand } from "@aws-sdk/lib-dynamodb"
import { getDynamoDBDocumentClient } from "./helpers.mjs"

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.ASSISTANCES_TABLE_NAME

/**
 * This lambda function is responsible for returning all open assistances
 */
export const handler = async (event) => {
  // write to cloudwatch
  console.info('received:', event)

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Credentials": true,
  }

  // setting query parameters
  let params = {
    TableName: tableName,
    IndexName: "OpenAssistances",
    KeyConditionExpression: "#OpenAssistance = :v1",
    ExpressionAttributeNames: { "#OpenAssistance": "OpenAssistance" },
    ExpressionAttributeValues: { ":v1": "OPEN" }
  }

  // checking for pagination parameters
  if (event.queryStringParameters?.PartitionKey) {
    params.ExclusiveStartKey = {
      OpenAssistance: "OPEN",
      PartitionKey: event.queryStringParameters.PartitionKey
    }
  }

  // looking for open assistances
  const { "$metadata": metadata, Items, LastEvaluatedKey } = await docClient.send(new QueryCommand(params))

  // writing to cloudwatch
  console.info('metadata:', metadata)

  // returning success message
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ Items, LastEvaluatedKey })
  }
}