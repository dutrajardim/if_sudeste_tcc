import { S3Client, S3 } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { unmarshall } from "@aws-sdk/util-dynamodb"
import https from "https"

const bucketName = process.env.BUCKET_NAME
const token = process.env.USER_ACCESS_TOKEN


/**
 * This function receive a batch of events of message, accumulate
 * them in a object/hash by key, and then download medias
 * 
 * @param {*} event AWS DynamoDB Event Object
 */
export const handler = async (event) => {
  // write to cloudwatch
  console.info('received:', JSON.stringify(event))

  // getting records from event and create a hash object with partition key
  const notifications = chunkRecords(event.Records)

  // for each key/hash will update or insert new ticket
  await Promise.all(Object.keys(notifications).map(async (partitionKey) => {

    for (const notification of notifications[partitionKey]) {

      console.log(notification)

      const partitionKey = notification?.PartitionKey
      const idKey = Object.keys(notification?.Payload).find(key => /^.*Id$/.test(key))
      const mediaId = notification?.Payload?.[idKey]

      if (!mediaId) {
        console.error("Media ID does not found!")
        continue
      }

      const url = `https://graph.facebook.com/v17.0/${mediaId}/`
      const waResponse = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })

      const waResponseJson = await waResponse.json()
      console.log(waResponseJson)


      if (waResponseJson?.url) {
        const url = new URL(waResponseJson.url)
        const options = {
          hostname: url.hostname,
          path: `${url.pathname}${url.search}`,
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'curl/7.54.1'
          }
        }

        const data = await new Promise(resolve => {
          https.get(options, res => {
            let data = []

            res.on('data', chunk => data.push(chunk))
              .on('end', () => resolve(Buffer.concat(data)))
          })
        })

        try {
          const mimeType = waResponseJson.mime_type.split(";")[0].split("/").at(-1)

          const upload = new Upload({
            client: new S3({}) || new S3Client({}),
            params: {
              Bucket: bucketName,
              Key: `protected/${partitionKey}/${mediaId}.${mimeType}`,
              Body: data
            }

          })
          await upload.done()
        } catch (err) {
          console.error(err)
        }

      }

    }

  }))
}

/**
 *  This function receive a batch records of messages, accumulate
 *  them in a object/hash by key (client key)
 */
function chunkRecords(records) {

  return records
    // filtering new records of type message
    .filter(({ eventName, dynamodb }) =>
      eventName === 'INSERT' && // if new record
      ['image', 'document', 'audio', 'video'].includes(dynamodb.NewImage?.Payload?.M?.MessageType?.S)) // if is a media

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