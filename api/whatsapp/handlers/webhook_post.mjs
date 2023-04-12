// Create clients and set shared const values outside of the handler.

import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto'
import { getDynamoDBDocumentClient, getMessagePayload, getStatusPayload, flattenKeys } from './helpers.mjs';


const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.NOTIFICATIONS_TABLE_NAME;

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

    let putRequests = []

    for (let entry of body.entry) {
        for (let change of entry.changes) {

            let baseItem = {
                AccountId: entry.id,
                PhoneNumberId: change.value.metadata.phone_number_id,
                DisplayPhoneNumber: change.value.metadata.display_phone_number,
            }

            const messageItems = (change.value.messages || []).map((message, key) => {
                const contact = change.value.contacts?.[key]

                let putRequest = formatPutRequest(baseItem, message, 'message')
                if (contact) putRequest.PutRequest.Item.Payload.NotificationContact = flattenKeys(contact)

                return putRequest

            })
            const statusItems = (change.value.statuses || []).map(status => formatPutRequest(baseItem, status, 'status'))
            putRequests = [...putRequests, ...messageItems, ...statusItems]
        }
    }

    await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
            [tableName]: putRequests
        }
    }))

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

    return response;
}

function formatPutRequest(baseItem, notification, notificationType) {
    let payload, customerId

    if (notificationType === 'status') {
        payload = getStatusPayload(notification)
        payload.Status = notification.status
        customerId = notification.recipient_id
    }

    if (notificationType === 'message') {
        payload = getMessagePayload(notification)
        payload.MessageType = notification.type
        customerId = notification.from
    }

    return {
        PutRequest: {
            Item: {
                ...baseItem,
                NotificationType: notificationType,
                NotificationId: crypto.randomUUID(),
                CustomerId: customerId,
                MessageId: notification.id,
                Timestamp: Number(notification.timestamp),
                DateTimestamp: (notification.timestamp - (notification.timestamp % (24 * 60 * 60 * 1000))),
                Payload: payload
            }
        }
    }
}