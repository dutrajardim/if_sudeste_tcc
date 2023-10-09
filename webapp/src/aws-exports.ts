import { Auth } from 'aws-amplify'

// setting backend resources
export default {
  Auth: {
    identityPoolId: "",
    region: "",
    userPoolId: "",
    userPoolWebClientId: ""
  },
  API: {
    endpoints: [
      {
        name: "AssistancesApi",
        endpoint: "",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      },
      {
        name: "WhatsappApi",
        endpoint: "",
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
          }
        }
      },
      {
        name: "PersonalDataApi",
        endpoint: "",
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
      bucket: "",
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

export const websocketEndpoint = ""
