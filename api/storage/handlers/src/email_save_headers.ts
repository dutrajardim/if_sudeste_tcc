import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { getDynamoDBDocumentClient } from './helpers/dynamodb'
import { simpleParser } from "mailparser"

import type { S3CreateEvent } from "aws-lambda"

const tableName = process.env.EMAILS_TABLE_NAME

/**
 * This funciton is resposible for saving email
 * header in the dynamo table
 * 
 * @param event 
 */
export async function handler(event: S3CreateEvent): Promise<void> {

  // config db client
  const docClient = getDynamoDBDocumentClient()
  console.info('received:', JSON.stringify(event))

  await Promise.all(event.Records.map(async (record) => {

    const eventBucketName = record.s3.bucket.name
    const eventBucketKey = record.s3.object.key

    const client = new S3Client({ region: record.awsRegion })

    const response = await client.send(new GetObjectCommand({
      Bucket: eventBucketName,
      Key: eventBucketKey
    }))

    if (response.Body) {
      const textBody = await response.Body.transformToString()
      const parsed = await simpleParser(textBody)

      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: {
          PartitionKey: parsed.from?.value[0].address,
          SortKey: `${eventBucketName}/${eventBucketKey}`,
          NotificationType: "email",
          MessageId: parsed.messageId,
          Timestamp: parsed.date?.getTime() ?? Date.parse(record.eventTime),
          Payload: {
            FromName: parsed.from?.value[0].name,
            To: Array.isArray(parsed.to) ? parsed.to.flatMap(v => v.value.map(v => v.address)) : parsed.to?.value.map(v => v.address),
            Subject: parsed.subject,
            CC: Array.isArray(parsed.cc) ? parsed.cc.flatMap(v => v.value.map(v => v.address)) : [parsed.cc?.value.map(v => v.address)],
            BCC: Array.isArray(parsed.bcc) ? parsed.bcc.flatMap(v => v.value.map(v => v.address)) : [parsed.bcc?.value.map(v => v.address)],
            InReplyTo: parsed.inReplyTo,
            ReplyTo: parsed.replyTo?.value.map(v => v.address),
            References: Array.isArray(parsed.references) ? parsed.references : [parsed.references]
          }
        }
      }))
    }

  }))

}