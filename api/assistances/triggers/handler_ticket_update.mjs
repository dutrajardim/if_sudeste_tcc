import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const endpoint = process.env.DYNAMODB_ENDPOINT
const tableName = process.env.ASSISTANCES_TABLE_NAME

/**
 * This function receive a batch of events of message, accumulate
 * them in a object/hash by key, then create or updating a ticket for each
 * client (hash/key) counting the open message in the batch
 * 
 * @param {*} event AWS DynamoDB Event Object
 */
export const handler = async (event) => {
  // write to cloudwatch
  console.info('received:', JSON.stringify(event))

  // getting records from event and create a hash object with partition key
  const notifications = chunkRecords(event.Records)

  // get client
  const docClient = getDynamoDBDocumentClient()

  // for each key/hash will update or insert new ticket
  await Promise.all(Object.keys(notifications).map(async (partitionKey) => {

    // looking for a open ticket
    const { Items: [ticket], "$metadata": metadata } = await docClient.send(new QueryCommand({
      TableName: tableName,
      IndexName: "OpenAssistances",
      KeyConditionExpression: "#OpenAssistance = :v1 and #PartitionKey = :v2",
      ExpressionAttributeNames: {
        "#OpenAssistance": "OpenAssistance",
        "#PartitionKey": "PartitionKey"
      },
      ExpressionAttributeValues: {
        ":v1": "OPEN",
        ":v2": partitionKey
      },
      Limit: 1
    }))

    // writing to cloudwatch
    console.info('query ticket metadata', metadata)
    console.info('ticket: ', ticket)

    // getting current time in seconds
    const curTime = Math.floor((new Date()).getTime() / 1000)

    if (ticket) // updating the ticket if it exists
      await docClient.send(new UpdateCommand({
        TableName: tableName,
        Key: {
          PartitionKey: ticket.PartitionKey,
          SortKey: ticket.SortKey
        },
        UpdateExpression: "add #Unreaded :value",
        ExpressionAttributeNames: { "#Unreaded": "Unreaded" },
        ExpressionAttributeValues: { ":value": notifications[partitionKey].length } // increment the quantity of notifications
      }))
    // creating a new ticket if it does not exists
    else await docClient.send(new PutCommand({
      TableName: tableName,
      Item: {
        PartitionKey: partitionKey,
        SortKey: `${curTime}-ticket`,
        OpenAssistance: "OPEN",
        Unreaded: notifications[partitionKey].length,
        CreatedAt: curTime
      }
    }))

  }))
}

/**
 *  This function receive a batch records of messages, accumulate
 *  them in a object/hash by key (client key)
 */
function chunkRecords(records) {

  return records
    // filtering new records of type message
    .filter(({ eventName, dynamodb }) => eventName === 'INSERT' && dynamodb.NewImage?.NotificationType?.S === 'message')
    // create an object to store chunks of message by client key
    .reduce((acc, { dynamodb }) => {
      // simplifing db response format
      const document = unmarshall(dynamodb.NewImage)

      return {
        ...acc,
        [document.PartitionKey]: [...(acc[document.PartitionKey] || []), document]
      }
    }, {})
}

/**
 * configure dynamodb document client
 */
function getDynamoDBDocumentClient() {
  const dynamoConfig = {}

  // if endpoint is set, use it to configure the client
  if (endpoint?.startsWith('http'))
    dynamoConfig.endpoint = endpoint

  // istantiente the client
  const client = new DynamoDBClient(dynamoConfig)
  // istantiente the document client
  const ddbDocClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      convertEmptyValues: true,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    }
  })

  return ddbDocClient
}
