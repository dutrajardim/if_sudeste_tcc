type PersonalDataLabel = keyof PersonalData

interface PersonalDataKey {
  PartitionKey: string
  SortKey: PersonalDataLabel
}

interface PersonalDataItem extends PersonalDataKey {
  Data: string
}

// Data here is the user profile name
interface TelephonesPersonalData extends PersonalDataItem {
  WhatsappId: string
  CreatedAt: number
  SortKey: "contact#telephones"
}

interface PersonalData {
  "contact#telephones": TelephonesPersonalData
}

interface PersonalDataInitialState {
  data: Partial<PersonalData>
  fetchPersonalData: AsyncThunkState
}