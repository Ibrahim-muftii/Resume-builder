type LoggerMethod = (...args: Parameters<typeof console.log>) => void;

type Logger = {
  log: LoggerMethod;
  warn: LoggerMethod;
  error: LoggerMethod;
  info: LoggerMethod;
};

const noop: LoggerMethod = () => undefined;

const createConsoleMethod = (
  method: "log" | "warn" | "error" | "info"
): LoggerMethod => {
  return (...args: Parameters<typeof console.log>) => {
    console[method](...args);
  };
};

const isProduction = process.env.NODE_ENV === "production";

const developmentLogger: Logger = {
  log: createConsoleMethod("log"),
  warn: createConsoleMethod("warn"),
  error: createConsoleMethod("error"),
  info: createConsoleMethod("info"),
};

const productionLogger: Logger = {
  log: noop,
  warn: noop,
  error: noop,
  info: noop,
};

export const logger: Logger = isProduction ? productionLogger : developmentLogger;