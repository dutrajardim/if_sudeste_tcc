
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'

const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME

export const handler = async (event) => {
    console.info('received:', event)

    let params = {
        TableName: tableName,
        Item: {
            Id: event.requestContext.connectionId,
            TTL: parseInt((Date.now() / 1000) + 3600)
        }
    }

    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("DB PutCommand answer:", data);

    const response = {
        statusCode: 200,
        body: 'Connected.'
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.requestContext.routeKey} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}