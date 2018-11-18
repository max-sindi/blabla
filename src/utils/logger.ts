import log from 'console-log-level'
const loggingMode = process.env.LOGGING_LEVEL || 'debug'

// this is a place where mode defines
export const logger = log({ level: loggingMode })

export default logger
