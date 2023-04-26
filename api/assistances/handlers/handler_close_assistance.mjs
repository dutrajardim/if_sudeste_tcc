import { UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { getDynamoDBDocumentClient } from "./helpers.mjs"

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.ASSISTANCES_TABLE_NAME

/**
 * This lambda function is responsible for changing assistance status from open to close 
 */
export const handler = async (event) => {
  // writing to cloudwatch
  console.info('received:', event)

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*",
    "Access-Control-Allow-Methods": "PATCH",
    "Access-Control-Allow-Credentials": true,
  }

  // getting the path parameters
  const { partitionKey, sortKey } = event.pathParameters

  // updating database
  const { "$metadata": metadata, ...dbResponse } = await docClient.send(new UpdateCommand({
    TableName: tableName,
    Key: {
      PartitionKey: partitionKey,
      SortKey: sortKey
    },
    UpdateExpression: "set #ClosedAt = :v1 remove #OpenAssistance",
    ExpressionAttributeNames: {
      "#OpenAssistance": "OpenAssistance",
      "#ClosedAt": "ClosedAt"
    },
    ExpressionAttributeValues: {
      ":v1": Math.floor((new Date()).getTime() / 1000)
    }
  }))

  // writing to cloudwatch
  console.info('metadata:', metadata)

  // returning success message
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(dbResponse)
  }
}