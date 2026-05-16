import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number; code?: number;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 409;
  }
  if (err.name === 'ValidationError' && err.errors) {
    message = Object.values(err.errors).map(e => e.message).join(', '); statusCode = 400;
  }
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token.'; statusCode = 401; }
  if (err.name === 'TokenExpiredError') { message = 'Token expired.'; statusCode = 401; }
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
