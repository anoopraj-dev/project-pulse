import AppError from '../utils/AppError.js';


/** Mongoose CastError – invalid ObjectId */
const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

/** Mongoose duplicate key (E11000) */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field];
  return new AppError(
    `Duplicate value "${value}" for field "${field}". Please use a different value.`,
    409
  );
};

/** Mongoose ValidationError */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

/** JWT errors */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again.', 401);

// ─── Response senders ──────────────────────────────────────────────────────────

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    console.error('UNHANDLED ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};


const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || (String(err.statusCode).startsWith('4') ? 'fail' : 'error');

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    let normalizedErr = { ...err, message: err.message, name: err.name };

    if (err.name === 'CastError')           normalizedErr = handleCastError(err);
    if (err.code === 11000)                 normalizedErr = handleDuplicateKeyError(err);
    if (err.name === 'ValidationError')     normalizedErr = handleValidationError(err);
    if (err.name === 'JsonWebTokenError')   normalizedErr = handleJWTError();
    if (err.name === 'TokenExpiredError')   normalizedErr = handleJWTExpiredError();

    sendProdError(normalizedErr, res);
  }
};


export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export default errorHandler;
