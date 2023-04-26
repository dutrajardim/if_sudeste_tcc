// This is the verify token value from Meta webhook set up.
const verifyToken = process.env.VERIFY_TOKEN

/**
 * This Lambda function is responsible for returning info on whatsapp verification request (setting up whatsapp endpoint)
 */
export const handler = async (event) => {
    // Write to CloudWatch
    console.info('received:', event)

    // preparing headers
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*.facebook.com",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Credentials": true,
    }

    // getting parrameters from query
    let mode = event.queryStringParameters?.["hub.mode"]
    let token = event.queryStringParameters?.["hub.verify_token"]
    let challenge = event.queryStringParameters?.["hub.challenge"]

    // checking required params (returning error if true)
    if (!(mode && token))
        return { headers, statusCode: 500, body: JSON.stringify({ message: "Invalid request! The query parameters 'mode' and 'token' are both required!" }) }

    // checking if tokens match (returning error if true)
    if (!(mode === 'subscribe' && token === verifyToken))
        return { headers, statusCode: 403, body: JSON.stringify({ message: "Verify token does not match or mode different from 'subscribe'" }) }


    // Write to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${200} body: ${challenge}`)

    // returning success response
    return { headers, statusCode: 200, body: challenge }
}
