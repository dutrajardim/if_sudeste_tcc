import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers/dynamodb'

import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"

const tableName = process.env.EMAILS_TABLE_NAME

interface QueryStringParameters {
  exclusiveStartKey?: string
  limit?: string
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {

  // preparing response headers
  let response: APIGatewayProxyResultV2 = {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "https://*,http://*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Credentials": true,
    }
  }

  try {

    const queryStringParameters = event.queryStringParameters as QueryStringParameters
    const exclusiveStartKey = JSON.parse(queryStringParameters?.exclusiveStartKey || "{}")
    const limit = Number(queryStringParameters?.limit || 0)

    const docClient = getDynamoDBDocumentClient()

    let params: QueryCommandInput = {
      TableName: tableName,
      IndexName: "NotificationTypeByTimestamp",
      KeyConditionExpression: "#NotificationType = :notificationType",
      ExpressionAttributeNames: { "#NotificationType": "NotificationType" },
      ExpressionAttributeValues: { ":notificationType": "email" },
      ScanIndexForward: false
    }

    if (Object.keys(exclusiveStartKey).length > 0)
      params.ExclusiveStartKey = exclusiveStartKey

    if (limit)
      params.Limit = limit

    const { "$metadata": metadata, ...dbResponse } =
      await docClient.send(new QueryCommand(params))

    response.statusCode = 200
    response.body = JSON.stringify(dbResponse)
  }
  catch (error: any) {

    // response.body = JSON.stringify({ message: error.message })
    response.statusCode = 500
    response.body = JSON.stringify({ message: "Erro interno. Tente novamente mais tarde!" })

  }

  return response
}