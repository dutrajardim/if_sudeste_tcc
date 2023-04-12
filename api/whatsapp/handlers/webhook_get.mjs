// This is the verify token value from Meta webhook set up.
const verifyToken = process.env.VERIFY_TOKEN;

/**
 * This Lambda function is responsible for returning info on whatsapp verification request (setting up whatsapp endpoint)
 */
export const handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`queryMethod only accept GET method, you tried: ${event.httpMethod}`);
    }
    // Write to CloudWatch
    console.info('received:', event);

    // getting parrameters from query
    let mode = event.queryStringParameters?.["hub.mode"]
    let token = event.queryStringParameters?.["hub.verify_token"]
    let challenge = event.queryStringParameters?.["hub.challenge"]

    // checking required params
    if (!(mode && token)) {
        throw new Error(`Invalid request! The query parameters 'mode' and 'token' are both required!`);
    }

    // setting default error message for token mismatch
    let response = {
        statusCode: 403,
        body: JSON.stringify({ message: "Verify token does not match or mode different from 'subscribe'" })
    }

    // setting challenge message if tokens match
    if (mode === 'subscribe' && token === verifyToken) {
        response = {
            statusCode: 200,
            body: challenge
        };
    }


    // Write to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

    return response;
}
