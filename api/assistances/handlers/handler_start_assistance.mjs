import { UpdateCommand } from "@aws-sdk/lib-dynamodb"
import { AdminGetUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider"
import { getDynamoDBDocumentClient } from "./helpers.mjs"

const docClient = getDynamoDBDocumentClient()
const tableName = process.env.ASSISTANCES_TABLE_NAME

/**
 *  This lambda function is responsible for start service
 */
export const handler = async (event) => {
  // writing to cloudwatch
  console.info('received:', JSON.stringify(event))

  // preparing headers
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://*",
    "Access-Control-Allow-Methods": "PATCH",
    "Access-Control-Allow-Credentials": true,
  }

  // getting the path parameters
  const { partitionKey, sortKey } = event.pathParameters

  const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION })

  const iss = event.requestContext.authorizer.jwt.claims.iss
  const UserPoolId = iss.substring(iss.lastIndexOf('/') + 1)
  const Username = event.requestContext.authorizer.jwt.claims.sub

  const input = { UserPoolId, Username }
  const command = new AdminGetUserCommand(input)
  const user = await cognitoClient.send(command)

  const userAttributes = user.UserAttributes.reduce((acc, cur) => (acc[cur.Name] = cur.Value, acc), {})

  // updating database
  const { "$metadata": metadata, ...dbResponse } = await docClient.send(new UpdateCommand({
    TableName: tableName,
    Key: {
      PartitionKey: partitionKey,
      SortKey: sortKey
    },
    UpdateExpression: "set #Attendent = :v1",
    ExpressionAttributeNames: {
      "#Attendent": "Attendent"
    },
    ExpressionAttributeValues: {
      ":v1": {
        Username,
        Name: userAttributes["name"],
        Email: userAttributes["email"],
        PhoneNumber: userAttributes["phone_number"]
      }
    }
  }))

  // writing to cloudwatch
  console.info('metadata:', metadata)

  // returning success message
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify(dbResponse)
  }
}