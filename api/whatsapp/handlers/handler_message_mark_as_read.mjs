import { getDynamoDBDocumentClient } from './helpers.mjs'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.NOTIFICATIONS_TABLE_NAME
const token = process.env.USER_ACCESS_TOKEN

/**
 * This lambda function is responsible for receive whatsapp events and store it
 */
export const handler = async (event) => {
  // Write to CloudWatch
  console.info('received:', event);

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*,http://",
    "Access-Control-Allow-Methods": "PUT",
    "Access-Control-Allow-Credentials": true,
  }

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const body = JSON.parse(event.body);
  const { phoneNumberId } = event.pathParameters

  // user info
  const Username = event.requestContext.authorizer.jwt.claims.sub

  // proxing whatsapp API
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`

  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: tableName,
      Key: {
        PartitionKey: body["partitionKey"],
        SortKey: body["sortKey"]
      },
      UpdateExpression: "set #Unreaded = :v1",
      ConditionExpression: "#OpenAssistance = :v2 AND #Attendent.#Username = :v3",
      ExpressionAttributeNames: {
        "#Unreaded": "Unreaded",
        "#OpenAssistance": "OpenAssistance",
        "#Attendent": "Attendent",
        "#Username": "Username"
      },
      ExpressionAttributeValues: {
        ":v1": 0,
        ":v2": "OPEN",
        ":v3": Username
      }
    }))

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "status": "read",
        "messaging_product": "whatsapp",
        "message_id": body["messageId"]
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    console.log(await response.json())
  } catch (error) {
    console.error(error)
  }

  // Write to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${200}`);

  // returning success message
  return {
    headers,
    statusCode: 200,
    body: event.body
  }
}
