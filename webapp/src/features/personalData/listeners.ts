import { Cache } from "aws-amplify"
import { AppStartLitening } from "../../listenerMiddleware"
import { fetchPersonalData } from "./asyncThunks"
import { putPersonalData } from "./personalDataSlice"


export default function (startListening: AppStartLitening) {

  /**
   * Recovery personal data from cache
   */
  startListening({
    actionCreator: fetchPersonalData.pending,
    effect: async (action, listenerApi) => {
      const actionName = fetchPersonalData.fulfilled.type.split("/").slice(0, -1).join('/')

      const cacheKey = `${actionName}#${action.meta.arg}`

      const cache = (Cache.getItem(cacheKey) ?? {}) as PersonalData
      listenerApi.dispatch(putPersonalData(cache))
    }
  })

  /**
   * Save cache of personal data requisitions
   */
  startListening({
    actionCreator: fetchPersonalData.fulfilled,
    effect: async (action) => {
      const actionName = fetchPersonalData.fulfilled.type.split("/").slice(0, -1).join('/')
      const cacheKey = `${actionName}#${action.meta.arg}`

      const oldCache = (Cache.getItem(cacheKey) ?? {}) as PersonalData

      const expires = Date.now() + 60 * 20 * 1000 // 20 min
      const priority = 1 // lower priority

      Cache.setItem(cacheKey, { ...oldCache, ...action.payload }, { expires, priority })
    }
  })
}