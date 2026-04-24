/**
 * Centralized logging utility
 * Logs errors server-side without exposing details to clients
 */

const logger = {
  error: (context, error) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${context}`, {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
    });
  },

  info: (message, data = {}) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },

  warn: (message, data = {}) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  },
};

export default logger;
