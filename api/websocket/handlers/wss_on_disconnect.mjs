
import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers.mjs'

const ddbDocClient = getDynamoDBDocumentClient()
const tableName = process.env.CONNECTIONS_TABLE_NAME

export const handler = async (event) => {
    console.info('received:', event)

    let params = {
        TableName: tableName,
        Key: {
            Id: event.requestContext.connectionId
        }
    }

    const data = await ddbDocClient.send(new DeleteCommand(params));
    console.log("DB DeleteCommand answer:", data);

    const response = {
        statusCode: 200,
        body: 'Disconnected.'
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.requestContext.routeKey} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}