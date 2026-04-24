/**
 * Centralized logging utility
 * Logs errors server-side without exposing details to clients
 */

const logger = {
  error: (context, error) => {
    // Normalize any thrown value (Error, string, null, etc) to a safe log format
    const normalizedMessage =
      error instanceof Error
        ? error.message
        : error == null
          ? String(error)
          : typeof error === "object" && typeof error.message === "string"
            ? error.message
            : String(error);

    const normalizedStack =
      error instanceof Error
        ? error.stack
        : error != null &&
            typeof error === "object" &&
            typeof error.stack === "string"
          ? error.stack
          : undefined;

    console.error(`[ERROR] ${context}`, {
      timestamp: new Date().toISOString(),
      message: normalizedMessage,
      stack: normalizedStack,
    });
  },

  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },

  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
};

export default logger;
