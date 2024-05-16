const { format, createLogger, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;
const _constantUtil = require('./ATcontant.util');

const { ERROR_LOG, INFO_LOG, LOG_TIMESTAMP_FORMAT } = _constantUtil;

const logLevel = {
    level: ERROR_LOG,
    level: INFO_LOG
}

const logger = createLogger({
    format: combine(
        timestamp({ format: LOG_TIMESTAMP_FORMAT }),
        prettyPrint()
    ),
    transports: [new transports.Console(logLevel)],
});

module.exports = logger;