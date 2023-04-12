// Create clients and set shared const values outside of the handler.

import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import crypto from 'crypto'
import { flattenKeys, getDynamoDBDocumentClient, getMessagePayload } from './helpers.mjs'


const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.NOTIFICATIONS_TABLE_NAME
const token = process.env.USER_ACCESS_TOKEN

/**
 * This lambda function is responsible for receive whatsapp events and store it
 */
export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // Write to CloudWatch
    console.info('received:', event);

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const body = JSON.parse(event.body);
    const { apiVersion, phoneNumberId } = event.pathParameters

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`
    const waResponse = await fetch(url, {
        method: "POST",
        body: event.body,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const waResponseJson = await waResponse.json()
    console.log('wa response:', waResponseJson)

    const putRequests = (waResponseJson?.messages || []).map((message, key) => {
        const contact = waResponseJson.contacts?.[key]
        let payload = getMessagePayload(body)
        payload.MessageType = message.type
        if (contact) payload.NotificationContact = flattenKeys(contact)

        return {
            PutRequest: {
                Item: {
                    NotificationType: "sent",
                    NotificationId: crypto.randomUUID(),
                    CustomerId: body.to,
                    MessageId: message.id,
                    Timestamp: Math.floor((new Date()).getTime() / 1000),
                    DateTimestamp: (new Date()).setUTCHours(0, 0, 0, 0) / 1000,
                    Payload: payload
                }
            }
        }
    })

    console.log('put requests', JSON.stringify(putRequests))

    const dbResponse = await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
            [tableName]: putRequests
        }
    }))

    console.log('db response:', dbResponse)

    const response = {
        statusCode: 200,
        body: JSON.stringify(waResponseJson)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

    return response;
}
