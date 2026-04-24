/**
 * Error handling middleware for JSON parsing errors
 * Handles invalid JSON bodies and passes other errors to next handler
 */
export function jsonErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON body",
    });
  }
  next(err);
}
