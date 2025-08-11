import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError, HttpStatus } from '../utils';

// Extend Express Response interface with custom methods
declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, code?: HttpStatus): Response;

      fail<E>(error: E | string, code?: HttpStatus): Response;
    }
  }
}

// Middleware to add custom response methods to all responses
export function responseMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // Add success method for consistent success responses
  res.success = <T>(data: T, code: HttpStatus = HttpStatus.OK): Response =>
    sendSuccess(res, data, code);

  // Add fail method for consistent error responses
  res.fail = <E>(error: E | string, code?: HttpStatus): Response =>
    sendError(res, typeof error === 'string' ? error : (error as Error).message, code ?? HttpStatus.INTERNAL_SERVER_ERR, typeof error === 'object' && !(typeof error === 'string') ? error : undefined);
  next();
}
