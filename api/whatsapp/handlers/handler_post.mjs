// Create clients and set shared const values outside of the handler.

import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient, getMessagePayload, getStatusPayload, flattenKeys } from './helpers.mjs'


const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.NOTIFICATIONS_TABLE_NAME

/**
 * This lambda function is responsible for receive whatsapp events and store it
 */
export const handler = async (event) => {
    // Write to CloudWatch
    console.info('received:', event)

    // preparing headers
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*.facebook.com",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Credentials": true,
    }

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const body = JSON.parse(event.body)

    let putRequests = []

    // navvigating through body structure
    for (let entry of body.entry) {
        for (let change of entry.changes) {

            // extracting common information
            let baseItem = {
                AccountId: entry.id,
                PhoneNumberId: change.value.metadata.phone_number_id,
                DisplayPhoneNumber: change.value.metadata.display_phone_number,
            }

            // navigating through messages items if it exists (messages notifications)
            const messageItems = (change.value.messages || []).map((message, key) => {
                // getting contacts field
                const contact = change.value.contacts?.[key]

                let putRequest = formatPutRequest(baseItem, message, 'message')
                if (contact) putRequest.PutRequest.Item.Payload.NotificationContact = flattenKeys(contact)

                return putRequest

            })

            // navigating through statuses items if it exists (status notifications)
            const statusItems = (change.value.statuses || []).map(status => formatPutRequest(baseItem, status, 'status'))

            // concating data
            putRequests = [...putRequests, ...messageItems, ...statusItems]
        }
    }

    // writting data to database
    await ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
            [tableName]: putRequests
        }
    }))

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${200} body: ${JSON.stringify(body)}`)

    // returning success message
    return {
        headers,
        statusCode: 200,
        body: JSON.stringify(body)
    }
}

/**
 * This function is responsible for transforming data from whatsapp notification payload
 * to dynamodb put request format
 * 
 * @param {*} baseItem 
 * @param {*} notification 
 * @param {string} notificationType 
 * @returns 
 */
function formatPutRequest(baseItem, notification, notificationType) {
    let payload, customerId

    if (notificationType === 'status') {
        // extracting fields from statuses notification
        payload = getStatusPayload(notification)
        payload.Status = notification.status
        customerId = notification.recipient_id
    }

    if (notificationType === 'message') {
        // extracting fields from message notification
        payload = getMessagePayload(notification)
        payload.MessageType = notification.type
        customerId = notification.from
    }

    // returning dynamodb put request item format
    return {
        PutRequest: {
            Item: {
                // setting table keys
                PartitionKey: customerId,
                SortKey: `${notification.timestamp}-${Math.random().toString(16).slice(2)}-wp`,
                // setting message data
                ...baseItem,
                NotificationType: notificationType,
                MessageId: notification.id,
                Timestamp: Number(notification.timestamp),
                // DateTimestamp: (notification.timestamp - (notification.timestamp % (24 * 60 * 60 * 1000))),
                Payload: payload
            }
        }
    }
}