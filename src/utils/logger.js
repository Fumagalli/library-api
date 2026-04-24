/**
 * Centralized logging utility
 * Logs errors server-side without exposing details to clients
 */

function error(context, err) {
  // Normalize any thrown value (Error, string, null, etc) to a safe log format
  const normalizedMessage =
    err instanceof Error
      ? err.message
      : err == null
        ? String(err)
        : typeof err === "object" && typeof err.message === "string"
          ? err.message
          : String(err);

  const normalizedStack =
    err instanceof Error
      ? err.stack
      : err != null && typeof err === "object" && typeof err.stack === "string"
        ? err.stack
        : undefined;

  console.error(`[ERROR] ${context}`, {
    timestamp: new Date().toISOString(),
    message: normalizedMessage,
    stack: normalizedStack,
  });
}

function info(message, metadata = {}) {
  console.log(`[INFO] ${message}`, {
    timestamp: new Date().toISOString(),
    ...metadata,
  });
}

function warn(message, metadata = {}) {
  console.warn(`[WARN] ${message}`, {
    timestamp: new Date().toISOString(),
    ...metadata,
  });
}

export default { error, info, warn };
