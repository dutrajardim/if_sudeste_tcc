import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export function getDynamoDBDocumentClient() {
  const dynamoConfig = {}
  const endpoint = process.env.DYNAMODB_ENDPOINT

  if (endpoint && endpoint.startsWith('http'))
    dynamoConfig["endpoint"] = process.env.DYNAMODB_ENDPOINT

  const client = new DynamoDBClient(dynamoConfig)
  const ddbDocClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: false,
      removeUndefinedValues: true,
      convertClassInstanceToMap: false
    },
    unmarshallOptions: {
      wrapNumbers: false
    }
  })

  return ddbDocClient
}