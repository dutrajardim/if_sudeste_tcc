import { Cache } from "aws-amplify";
import { AppStartLitening } from "../../listenerMiddleware";
import { fetchAssistanceTickets, fetchAssistanceMessages } from "./asyncThunks";
import { putTickets, putMessages } from "./assistancesSlice";

export default function (startListening: AppStartLitening) {

  /**
   * Recovery tickets from cache
   */
  startListening({
    actionCreator: fetchAssistanceTickets.pending,
    effect: async (action, listenerApi) => {
      const actionName = fetchAssistanceTickets.fulfilled.type.split("/").slice(0, -1).join('/')

      const cacheKey = `${actionName}#${action.meta.arg}`

      const cache = Cache.getItem(cacheKey, { callback: () => ({}) }) as Record<string, AssistanceTicket>
      listenerApi.dispatch(putTickets(cache))
    }
  })

  /**
   * Save cache of ticket requisitions
   */
  startListening({
    actionCreator: fetchAssistanceTickets.fulfilled,
    effect: async (action) => {
      const actionName = fetchAssistanceTickets.fulfilled.type.split("/").slice(0, -1).join('/')
      const cacheKey = `${actionName}#${action.meta.arg}`

      const oldCache = Cache.getItem(cacheKey, { callback: () => ({}) }) as Record<string, AssistanceTicket>

      const values = Object.values(action.payload ?? {})
        .sort((a: DbKey, b: DbKey) => a.SortKey > b.SortKey ? 1 : -1)

      if (values) {
        const expires = Date.now() + 60 * 120 * 1000 // 120 min
        const priority = 1 // lower priority
        const last = values.at(-1)?.CreatedAt

        Cache.setItem(cacheKey, { ...oldCache, ...action.payload }, { expires, priority })
        last && Cache.setItem(`${cacheKey}-last`, last, { expires, priority })
      }
    }
  })

  /**
   * Recovery messages from cache
   */
  startListening({
    actionCreator: fetchAssistanceMessages.pending,
    effect: async (action, listenerApi) => {
      const actionName = fetchAssistanceMessages.fulfilled.type.split("/").slice(0, -1).join('/')

      const cacheKey = `${actionName}#${action.meta.arg}`

      const cache = Cache.getItem(cacheKey, { callback: () => ({}) }) as Record<string, AssistanceMessageEvent>
      listenerApi.dispatch(putMessages(cache))
    }
  })

  /**
   * Save cache of message requisitions
   */
  startListening({
    actionCreator: fetchAssistanceMessages.fulfilled,
    effect: async (action) => {
      const actionName = fetchAssistanceMessages.fulfilled.type.split("/").slice(0, -1).join('/')
      const cacheKey = `${actionName}#${action.meta.arg}`

      const oldCache = Cache.getItem(cacheKey, { callback: () => ({}) }) as Record<string, AssistanceMessageEvent>

      const values = Object.values(action.payload ?? {})
        .sort((a: DbKey, b: DbKey) => a.SortKey > b.SortKey ? 1 : -1)

      if (values) {
        const expires = Date.now() + 60 * 120 * 1000 // 120 min
        const priority = 1 // lower priority
        const last = values.at(-1)?.Timestamp

        Cache.setItem(cacheKey, { ...oldCache, ...action.payload }, { expires, priority })
        last && Cache.setItem(`${cacheKey}-last`, last, { expires, priority })
      }
    }
  })
}