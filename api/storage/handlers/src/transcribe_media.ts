import { StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe"
import path from 'path'

import type { S3CreateEvent } from "aws-lambda"

const bucketName = process.env.BUCKET_NAME

/**
 * This function receive an event from S3 and checke
 * if it is a media to trascribe
 * 
 * @param {*} event AWS S3 Event Object
 */
export async function handler(event: S3CreateEvent): Promise<void> {

  const eventRecord = event.Records && event.Records[0]
  const inputBucket = eventRecord.s3.bucket.name
  const key = eventRecord.s3.object.key
  const region = eventRecord.awsRegion
  const jobName = path.parse(key).name;

  const extension = path.extname(key).substring(1)

  const fileUri = `https://${inputBucket}.s3.amazonaws.com/${key}`


  if (['mp3', 'mp4', 'wav', 'flac', 'ogg', 'amr', 'webm'].includes(extension)) {

    console.log('converting from ', fileUri, extension)

    const client = new TranscribeClient({ region })

    await client.send(new StartTranscriptionJobCommand({
      LanguageCode: "pt-BR",
      MediaFormat: extension,
      TranscriptionJobName: jobName,
      OutputBucketName: bucketName,
      OutputKey: `${path.dirname(key)}/${jobName}.json`,
      Media: {
        MediaFileUri: fileUri
      }
    }))
  }
}