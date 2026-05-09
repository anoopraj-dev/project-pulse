
class AppError extends Error {
  /**
   * @param {string}  message    - Human-readable error message sent to the client
   * @param {number}  statusCode - HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    /** Marks this as a known, intentional error (not a programmer bug) */
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
