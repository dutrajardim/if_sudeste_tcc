// Create clients and set shared const values outside of the handler.

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBDocumentClient } from './helpers.mjs';
import { v4 as uuidv4 } from 'uuid';


const ddbDocClient = getDynamoDBDocumentClient()
// Get the DynamoDB table name from environment variables
const tableName = process.env.CONTACT_REQUESTS_TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const postContactRequestHandler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`)
    }

    console.info('received:', event)

    const body = JSON.parse(event.body)
    const userName = body.user_name
    const campaignId = body.campaign_id
    const userEmail = body.userEmail
    const whatsappNumber = body.whatsapp_number
    const preferredChannel = body.preffered_channel

    var params = {
        TableName: tableName,
        Item: {
            Id: context?.awsRequestId || uuidv4(),
            UserName: userName,
            UserEmail: userEmail,
            CampaignId: campaignId,
            WhatsappNumber: whatsappNumber,
            preferredChannel: preferredChannel
        }
    };

    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("DB PutCommand answer:", data);

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
