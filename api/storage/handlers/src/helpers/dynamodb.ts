import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, TranslateConfig } from "@aws-sdk/lib-dynamodb"

/**
 * Define default configurations for dynamodb that
 * can be override
 * 
 * @param {TranslateConfig} config DynamoDB document client configuration 
 * @returns {DynamoDBDocumentClient} Client for dynamoDB
 */
export function getDynamoDBDocumentClient(config: TranslateConfig | undefined = {}): DynamoDBDocumentClient {

  const { marshallOptions = {}, unmarshallOptions = {} } = config

  const client = new DynamoDBClient({})

  const mergedConfig: TranslateConfig = {
    marshallOptions: {
      convertEmptyValues: false,
      removeUndefinedValues: true,
      convertClassInstanceToMap: true,
      ...marshallOptions
    },
    unmarshallOptions: {
      wrapNumbers: false,
      ...unmarshallOptions
    }
  }

  return DynamoDBDocumentClient.from(client, mergedConfig)
}

