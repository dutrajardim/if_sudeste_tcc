import { createAsyncThunk } from "@reduxjs/toolkit"
import { API } from "aws-amplify"

interface FetchPersonalDataOutput {
  Items: PersonalDataKey[],
  LastEvaluatedKey: PersonalDataKey
}

/**
 * Fetch personal data action
 */
export const fetchPersonalData = createAsyncThunk(
  "personalData/fetchPersonalData",

  async (partitionKey: string): Promise<Partial<PersonalData>> => {
    return {}
    // const data: FetchPersonalDataOutput = await API.get("PersonalDataApi", `/personal-data/${partitionKey}`, {
    //   queryStringParameters: {}
    // })

    // const personalData = data.Items.reduce((acc, cur) => (
    //   acc = { ...acc, [cur.SortKey]: cur } as PersonalData,
    //   acc
    // ), {} as Partial<PersonalData>)

    // return personalData
  }

)