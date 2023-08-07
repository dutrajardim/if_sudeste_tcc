import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export function getDynamoDBDocumentClient() {
    const dynamoConfig = {}
    const endpoint = process.env.DYNAMODB_ENDPOINT

    if (endpoint && endpoint.startsWith('http'))
        dynamoConfig["endpoint"] = process.env.DYNAMODB_ENDPOINT

    const client = new DynamoDBClient(dynamoConfig)
    const ddbDocClient = DynamoDBDocumentClient.from(client, {
        marshallOptions: {
            convertEmptyValues: false,
            removeUndefinedValues: true,
            convertClassInstanceToMap: false
        },
        unmarshallOptions: {
            wrapNumbers: false
        }
    })

    return ddbDocClient
}


export function getPayload(notification) {
    const keys = Object.keys(notification)
    return keys.reduce((acc, key) =>
        ({ ...acc, ...flattenKeys(notification[key], snakeToTitle(key)) }))
}

function snakeToTitle(text) {
    return text.split("_").filter(x => x.length > 0).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join("")
}

function isObject(x) {
    return Object.prototype.toString.call(x) === "[object Object]"
}

export function flattenKeys(givenObject, previousKey = "") {
    if (isObject(givenObject)) {
        return Object.keys(givenObject).reduce((acc, key) => {
            let newKey = previousKey + snakeToTitle(key)

            return { ...acc, ...flattenKeys(givenObject[key], newKey) }

        }, {})
    }

    else if (Array.isArray(givenObject) && previousKey) {
        return { [previousKey]: givenObject.map(v => flattenKeys(v)) }
    }

    else if (previousKey) {
        return { [previousKey]: givenObject }
    }
}