
/**
 * This function is used to compose the key from dynamodb assistance table.
 * 
 * @param item 
 * @returns string representing the key
 */
export function composeKey(item: DbKey) {
  return `${item.SortKey}#${item.PartitionKey}`
}

/**
 * Formats the telephone number
 * 
 * @param tel string representing the telephone number
 * @returns string representing the formatted telephone number
 */
export function formatTelephone(tel: string) {
  return tel.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, "+$1 $2 $3-$4")
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

  return times[0] ? `${times[0]} ${labels[labels.length - times.length]} atrás` : "agora"
}


/**
 *  This function is responsible for create a sort function predicate
 *  used to sort an object by key
 * 
 * @param key A string key of the object
 * @returns 
 */
export function sortByKey<T extends Record<string, any>>(key: keyof T) {
  return (a: T, b: T) => a[key] - b[key]
}

/**
 * Add or remove dark class to HTML dom
 * @param mode True for activate or false for deactivate
 */
export function setDarkMode(mode: boolean): void {
  mode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
}

/**
 * Creates a function that invokes a fybctuib with partials arguments 
 *  appended to the arguments it receives
 * 
 * @param fn the function will be called
 * @param partials the arguments
 * @returns a composed function
 */
export function partialRight<T extends (...args: any) => any>(fn: T, ...partials: any[]) {
  return (...args: any[]): ReturnType<T> => fn(...args, ...partials)
}

export function toLocaleDateString(val: any, style: "long" | "short" = "long"): string | typeof val {
  return typeof val === 'number' ? new Date(val * 1000).toLocaleDateString("pt-BR", { dateStyle: style }) : val
}

export function toLocaleTimeString(val: any): string | typeof val {
  return typeof val === 'number' ? new Date(val * 1000).toLocaleTimeString("pt-BR", { timeStyle: "short" }) : val
}
