import { Auth } from 'aws-amplify'

// setting backend resources
export default {
  Auth: {
    identityPoolId: "sa-east-1:395b3f7e-16af-4345-b21d-b84f90a87f56",
    region: "sa-east-1",
    userPoolId: "sa-east-1_KktjqZZ0J",
    userPoolWebClientId: "12820urt1ib220ch1shbhjo9bs"
  },
  API: {
    endpoints: [
      {
        name: "AssistancesApi",
        endpoint: "https://kly76cw9pa.execute-api.sa-east-1.amazonaws.com/beta",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      },
      {
        name: "WhatsappApi",
        endpoint: "https://iu63pyylr9.execute-api.sa-east-1.amazonaws.com/beta",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      },
      {
        name: "PersonalDataApi",
        endpoint: "https://k9faiq211f.execute-api.sa-east-1.amazonaws.com/beta",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      }
    ]
  },
  Storage: {
    AWSS3: {
      bucket: "studiol-storage-ffdsalk3234",
      region: "sa-east-1"
    }
  },
  predictions: {
    interpret: {
      interpretText: {
        region: 'us-east-1',
        proxy: false,
        defaults: {
          language: 'pt',
          type: 'ALL'
        },
      }
    }
  }
}

export const websocketEndpoint = "wss://1rqoj8vf98.execute-api.sa-east-1.amazonaws.com/beta"