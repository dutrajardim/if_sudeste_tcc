import { createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../store"

// exporting selecors

export { ticketUpdated, itemUpdated, setCustomer } from './assistancesSlice'

const getAuthenticatedUsername = (state: RootState) => state.auth.user?.Username
const getById = (_: RootState, id: string) => id
const compareById = (_: RootState, idA: string, idB: string) => [idA, idB]

export const selectActiveCustomer = (state: RootState) => state.assistances.ui.activeCustomer

// --- Open assistances selecotors

export const selectFetchOpenAssistancesState = (state: RootState) => state.assistances.fetchOpenAssistances.state
export const selectFetchOpenAssistancesError = (state: RootState) => state.assistances.fetchOpenAssistances.error

const getOpenAssistancesById = (state: RootState) => state.assistances.openAssistancesById

const selectOpenAssistances =
  createSelector(getOpenAssistancesById,
    (byId) => Object.keys(byId).sort((a, b) => byId[a].CreatedAt - byId[b].CreatedAt))

export const selectOpenAssistanceById =
  createSelector(getOpenAssistancesById, getById,
    (assistances, id) => assistances[id])

export const selectPendingOpenAssistances =
  createSelector(getOpenAssistancesById, selectOpenAssistances,
    (byId, assistances) => assistances.filter(id => !("Attendent" in byId[id])))

export const selectInProgressOpenAssistances =
  createSelector(getOpenAssistancesById, selectOpenAssistances,
    (byId, assistances) => assistances.filter(id => ("Attendent" in byId[id])))

// select in progress assistances attached to authenticated user 
export const selectMyInProgressOpenAssistances =
  createSelector(getOpenAssistancesById, selectInProgressOpenAssistances, getAuthenticatedUsername,
    (byId, assistances, username) => assistances.filter(id => byId[id].Attendent?.Username === username))

// select in progress assistances attached to otherUSers
export const selectFromOthersInProgressOpenAssistances =
  createSelector(getOpenAssistancesById, selectInProgressOpenAssistances, getAuthenticatedUsername,
    (byId, assistances, username) => assistances.filter(id => byId[id].Attendent?.Username !== username))



// --- Assistances selecors

export const selectFetchAssistanceTicketsState = (state: RootState) => state.assistances.fetchAssistanceTickets.state
export const selectFetchAssistanceTicketsError = (state: RootState) => state.assistances.fetchAssistanceTickets.error

export const selectFetchAssistanceMessagesState = (state: RootState) => state.assistances.fetchAssistanceMessages.state
export const selectFetchAssistanceMessagesError = (state: RootState) => state.assistances.fetchAssistanceMessages.error

export const selectSendWhatsappMessageState = (state: RootState) => state.assistances.sendWhatsappMessage.state
export const selectSendWhatsappMessageError = (state: RootState) => state.assistances.sendWhatsappMessage.error

export const selectStartAssistanceState = (state: RootState) => state.assistances.startAssistance.state
export const selectStartAssistanceError = (state: RootState) => state.assistances.startAssistance.error

export const selectCloseAssistanceState = (state: RootState) => state.assistances.closeAssistance.state
export const selectCloseAssistanceError = (state: RootState) => state.assistances.closeAssistance.error

export const selectMarkMessagesAsReadState = (state: RootState) => state.assistances.markMessagesAsRead.state
export const selectMarkMessagesAsReadError = (state: RootState) => state.assistances.markMessagesAsRead.error

// tickets

const getTicketsById = (state: RootState) => state.assistances.ticketsById

export const selectTickets =
  createSelector(getTicketsById,
    (byId) => Object.keys(byId).sort((a, b) => byId[b].CreatedAt - byId[a].CreatedAt))

export const selectTicketById = (state: RootState, id: string): AssistanceTicket =>
  state.assistances.ticketsById[id]

export const selectIsOpenTicket = (state: RootState, id: string): boolean =>
  selectTicketById(state, id).OpenAssistance === "OPEN"

export const selectIsPending = (state: RootState, id: string): boolean =>
  !("Attendent" in selectTicketById(state, id))

export const selectIsMyTicket =
  createSelector(getTicketsById, getAuthenticatedUsername, getById, (byId, username, id): boolean =>
    byId[id].Attendent?.Username === username)

export const selectMyOpenTicket =
  createSelector(getTicketsById, selectTickets, getAuthenticatedUsername,
    (byId, tickets, username) => tickets.find(ticket => byId[ticket].Attendent?.Username === username))

export const selectUnreadedMessages =
  createSelector(getTicketsById, selectMyOpenTicket,
    (byId, ticket) => ticket ? byId[ticket].Unreaded : 0)

// messages

const getMessages = (state: RootState): AssistanceMessageEvent[] =>
  Object.values(state.assistances.messagesById)

// gathtering messages events by message id
const statusOrder = { sent: 0, delivered: 1, read: 2 } as Record<string, number>
const initialIndex = { MessageId: '', Timestamp: Number.MAX_SAFE_INTEGER, Status: [], Message: null }
const updateMessageIndex =
  (cur: AssistanceMessageEvent, index: MessageIndex = initialIndex) => cur.NotificationType !== "status" ?
    { ...index, MessageId: cur.MessageId, Timestamp: Math.min(index.Timestamp, cur.Timestamp), Message: (cur as AssistanceMessageEvent), } :
    { ...index, MessageId: cur.MessageId, Timestamp: Math.min(index.Timestamp, cur.Timestamp), Status: [...index.Status, (cur as AssistanceMessageStatus)].sort((sa, sb) => statusOrder[sa.Payload.Status] - statusOrder[sb.Payload.Status]) }

const getMessagesById = createSelector(getMessages, (messages): Record<string, MessageIndex> =>
  messages.reduce((acc, cur) =>
    (acc[cur.MessageId] = updateMessageIndex(cur, acc[cur.MessageId]), acc), {} as Record<string, MessageIndex>))

export const selectMessages =
  createSelector(getMessagesById, (byId): string[] =>
    Object.keys(byId).sort((a, b) => byId[b].Timestamp - byId[a].Timestamp))

export const selectLastMessage =
  createSelector(selectMessages, (messages): string | undefined => messages.at(-1))

export const selectMessageById =
  createSelector(getMessagesById, getById, (byId, id): MessageIndex | undefined => byId?.[id])

export const selectMessageStatusById =
  createSelector(getMessagesById, getById, (byId, id): string | undefined => byId?.[id].Status.at(-1)?.Payload.Status)

export const selectIsMessageFromSameDay =
  createSelector(getMessagesById, compareById, (byId, [idA, idB]): boolean =>
    new Date(byId[idA].Timestamp * 1000).toDateString() === new Date(byId[idB].Timestamp * 1000).toDateString())