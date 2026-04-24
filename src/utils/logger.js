/**
 * Centralized logging utility
 * Logs errors server-side without exposing details to clients
 */

const logger = {
  error: (context, error) => {
    console.error(`[ERROR] ${context}`, {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
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
