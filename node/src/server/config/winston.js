var winston = require('winston');

var options = {
    file: {
      level: 'info',
      filename: `./node/config/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 2,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

  var logger = new winston.Logger({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  module.exports = logger;

/*
Logging levels indicate message priority and are denoted by an integer. Winston uses npm logging levels that are prioritized from 0 to 5 (highest to lowest):

0: error
1: warn
2: info
3: verbose
4: debug
5: silly

When specifying a logging level for a particular transport, anything at that level or higher will be logged.
For example, by specifying a level of info, anything at level error, warn, or info will be logged.
Log levels are specified when calling the logger, meaning we can do the following to record an error: logger.error('test error message').
*/