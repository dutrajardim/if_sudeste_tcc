import { AssistanceKey } from "../@types/app";

/**
 * This function is used to compose the key from dynamodb assistance table.
 * 
 * @param item 
 * @returns string representing the key
 */
export function composeKey(item: AssistanceKey) {
  return `${item.PartitionKey}#${item.SortKey}`
}

/**
 * Formats the telephone number
 * 
 * @param tel string representing the telephone number
 * @returns string representing the formatted telephone number
 */
export function formatTelephone(tel: string) {
  return tel.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4")
}

/**
 * Get the time difference between now and given time in seconds 
 * 
 * @param timeInSeconds to calculate the time since
 * @returns string representing the time since
 */
export function timeSince(timeInSeconds: number) {
  const timeDiff = (Math.floor(Date.now() / 1000) - timeInSeconds)

  const times = [
    Math.ceil(timeDiff / (60 * 60 * 24 * 365)), // year
    Math.ceil(timeDiff / (60 * 60 * 24 * 30)), // month
    Math.ceil(timeDiff / (60 * 60 * 24)), // day 
    Math.ceil(timeDiff / (60 * 60)), // hour
    Math.ceil(timeDiff / 60), // minute
    timeDiff].filter(v => v > 1)

  const labels = ["anos", "meses", "dias", "horas", "minutos", "segundos"]

  return `${times[0]} ${labels[labels.length - times.length]} atrás`
}