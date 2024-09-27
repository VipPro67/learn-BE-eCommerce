// "use strict";
// const { createLogger, transports, format } = require("winston");
// require("winston-daily-rotate-file");

// class MyLogger {
//   constructor() {
//     const formatPrint = (
//       level,
//       message,
//       context,
//       requestId,
//       timestamp,
//       metadata
//     ) => {
//       return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
//         metadata
//       )}`;
//     };

//     this.logger = createLogger({
//       format: format.combine(
//         format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//         format.printf(
//           ({ level, message, context, requestId, timestamp, metadata }) => {
//             return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(
//               metadata
//             )}`;
//           }
//         )
//       ),
//       transports: [
//         new transports.Console(),
//         new transports.DailyRotateFile({
//           dirname: "src/logs",
//           filename: "application-%DATE%.log",
//           datePattern: "YYYY-MM-DD-HH-mm",
//           zippedArchive: true,
//           maxSize: "1m",
//           maxFiles: "14d",
//           format: format.combine(
//             format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//             formatPrint
//           ),
//           level: "info",
//         }),
//         new transports.DailyRotateFile({
//           dirname: "src/logs",
//           filename: "error-%DATE%.log",
//           datePattern: "YYYY-MM-DD-HH-mm",
//           zippedArchive: true,
//           maxSize: "1m",
//           maxFiles: "14d",
//           format: format.combine(
//             format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//             formatPrint
//           ),
//           level: "error",
//         }),
//       ],
//     });
//   }

//   commonParams(params) {
//     let context, req, metadata;
//     if (Array.isArray(params)) {
//       context = params[0];
//       req = params[1];
//       metadata = params[2];
//     }
//     const requestId = req?.requestId || "unknown";
//     return { context, requestId, metadata };
//   }

//   log(message, params) {
//     const paramsLog = this.commonParams(params);
//     const logObject = Object.assign(
//       {
//         message,
//       },
//       paramsLog
//     );
//     this.logger.info(logObject);
//   }
//   error(message, params) {
//     const paramsLog = this.commonParams(params);
//     const logObject = Object.assign(
//       {
//         message,
//       },
//       paramsLog
//     );
//     this.logger.error(logObject);
//   }
// }

// module.exports = new MyLogger();
