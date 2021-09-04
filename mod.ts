import { blue, datetime, red, reset, yellow } from "./deps.ts";

const LOG_LEVELS = {
  debug: {
    color: reset,
    symbol: "✔",
  },
  info: {
    color: blue,
    symbol: "ℹ",
  },
  warn: {
    color: yellow,
    symbol: "⚠",
  },
  error: {
    color: red,
    symbol: "✖",
  },
};

export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log class. Timestamp-Level-Log for Deno.
 */
export class Log {
  private datetimeFormat: string;
  private levelSign: (logLevel: LogLevel) => string;
  private suffix: string[];

  /**
   * @param [minLogLevel="debug"] minimum level to log.
   * @param [levelIndicator="symbol"] indicator type of log level.
   * @param [datetimeFormat="YYYY-MM-ddTHH:mm:ssZ"] format of the timestamp.
   * @param [addNewLine=false] add new line after the each log or not.
   */
  constructor({
    minLogLevel = "debug",
    levelIndicator = "symbol",
    datetimeFormat = "YYYY-MM-ddTHH:mm:ssZ",
    addNewLine = false,
  }: {
    minLogLevel?: LogLevel;
    levelIndicator?: "none" | "full" | "initial" | "symbol";
    datetimeFormat?: string;
    addNewLine?: boolean;
  } = {}) {
    for (const level of Object.keys(LOG_LEVELS) as LogLevel[]) {
      if (minLogLevel === level) break;
      this[level] = () => ({});
    }

    this.datetimeFormat = datetimeFormat;
    this.suffix = addNewLine ? ["\n"] : [];

    this.levelSign = {
      none: () => "",
      full: (logLevel: LogLevel) => " " + logLevel.toUpperCase().padEnd(5),
      initial: (logLevel: LogLevel) => " " + logLevel[0].toUpperCase(),
      symbol: (logLevel: LogLevel) => " " + LOG_LEVELS[logLevel].symbol,
    }[levelIndicator];
  }

  /**
   * Generate log prefix with the specified configurations.
   * This is not needed for most normal users, but exported to test.
   */
  _prefix(date: Date, logLevel: LogLevel) {
    return LOG_LEVELS[logLevel].color(
      `${datetime(date).format(this.datetimeFormat)}${this.levelSign(logLevel)}`
        .trimStart(),
    );
  }

  private output(date: Date, logLevel: LogLevel, msg: unknown[]) {
    console[logLevel](this._prefix(date, logLevel), ...msg, ...this.suffix);
  }

  /**
   * Output `debug` level log with timestamp and level indicator.
   */
  debug(...msg: unknown[]) {
    this.output(new Date(), "debug", msg);
  }

  /**
   * Output `info` level log with timestamp and level indicator.
   */
  info(...msg: unknown[]) {
    this.output(new Date(), "info", msg);
  }

  /**
   * Output `warn` level log with timestamp and level indicator.
   */
  warn(...msg: unknown[]) {
    this.output(new Date(), "warn", msg);
  }

  /**
   * Output `error` level log with timestamp and level indicator.
   */
  error(...msg: unknown[]) {
    this.output(new Date(), "error", msg);
  }
}
