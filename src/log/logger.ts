import * as winston from "winston";
import { format } from "winston";
import moment from "moment-timezone";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, label, printf } = format;
const baseDir = process.cwd();

const appendTimestamp = format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment(new Date()).tz("UTC").format("YYYY-MM-DD HH:mm:ss"); // FOR UTC
  //   info.timestamp = moment(new Date()).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');  // FOR IST
  return info;
});

const myFormat = printf(
  (info) => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`
);

class Logger {
  public static logger: winston.Logger = winston.createLogger({
    format: combine(
      format.splat(),
      label({ label: "" }),
      appendTimestamp({ tz: "UTC" }),
      myFormat
    ),
    transports: [
      //    new winston.transports.File(this.fileLogOptions),
      new winston.transports.Console({
        level:
          typeof process.env.logLevel === "undefined"
            ? "debug"
            : process.env.logLevel,
        handleExceptions: true,
      }),
      new DailyRotateFile({
        level:
          typeof process.env.logLevel === "undefined"
            ? "debug"
            : process.env.logLevel,
        filename: "goose-resp-api-%DATE%.log",
        dirname: baseDir + "/logs",
        datePattern: "YYYY-MM-DD",
        maxSize: "30m", // 6MB
        maxFiles: "30d",
      }),
    ],
    exitOnError: false,
  });
}

export class LoggerStream {
  write(message: string) {
    Logger.logger.info(message.substring(0, message.lastIndexOf("\n")));
  }
}

export const logger = Logger.logger;
