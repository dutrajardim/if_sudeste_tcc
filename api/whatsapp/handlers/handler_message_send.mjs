import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import { AdminGetUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"

import { flattenKeys, getDynamoDBDocumentClient, getPayload } from './helpers.mjs'


const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.NOTIFICATIONS_TABLE_NAME
const token = process.env.USER_ACCESS_TOKEN

/**
 * This lambda function is responsible for receive whatsapp events and store it
 */
export const handler = async (event) => {

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*,http://",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Credentials": true,
  }

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const body = JSON.parse(event.body);
  const { phoneNumberId } = event.pathParameters

  // user info
  const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION })

  const iss = event.requestContext.authorizer.jwt.claims.iss
  const UserPoolId = iss.substring(iss.lastIndexOf('/') + 1)
  const Username = event.requestContext.authorizer.jwt.claims.sub

  const input = { UserPoolId, Username }
  const command = new AdminGetUserCommand(input)
  const user = await cognitoClient.send(command)

  const userAttributes = user.UserAttributes.reduce((acc, cur) => (acc[cur.Name] = cur.Value, acc), {})


  // proxing whatsapp API
  const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`
  const waResponse = await fetch(url, {
    method: "POST",
    body: event.body,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })

  // getting response body
  const waResponseJson = await waResponse.json()
  console.log('wa response:', waResponseJson)

  if (!('messages' in waResponseJson) || waResponseJson.messages.length < 1)
    return { headers, statusCode: 500, body: JSON.stringify({ message: "Error trying to send message. Contact your administrator." }) }

  // formatting to dynamodb put request item
  const putRequests = waResponseJson.messages.map((message, key) => {

    // checking for contacts field
    const contact = waResponseJson.contacts?.[key]
    // getting message payload
    let payload = getPayload(body)
    payload.MessageType = message.type
    // setting contact field
    if (contact) payload.NotificationContact = flattenKeys(contact)

    const sentTimestamp = Math.floor((new Date()).getTime() / 1000)

    // returning dynamodb put request item
    return {
      PutRequest: {
        Item: {
          // setting table keys
          PartitionKey: body.to,
          SortKey: `message#whatsapp#${sentTimestamp}#${Math.random().toString(16).slice(2)}`,
          // setting message data
          NotificationType: "sent",
          MessageId: message.id,
          Timestamp: sentTimestamp,
          // DateTimestamp: (new Date()).setUTCHours(0, 0, 0, 0) / 1000,
          Payload: payload,
          AttendentId: Username,
          Attendent: {
            Name: userAttributes["name"],
            Email: userAttributes["email"],
            PhoneNumber: userAttributes["phone_number"]
          }
        }
      }
    }
  })

  // Write to CloudWatch
  console.log('put requests', JSON.stringify(putRequests))

  // storing sent message
  const dbResponse = await ddbDocClient.send(new BatchWriteCommand({
    RequestItems: {
      [tableName]: putRequests
    }
  }))

  // Write to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${200} body: ${JSON.stringify(waResponseJson)}`);

  // returning success message
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(putRequests.map(item => item.PutRequest.Item))
  }
}
