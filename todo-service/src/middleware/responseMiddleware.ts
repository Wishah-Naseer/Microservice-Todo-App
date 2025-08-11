import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError, HttpStatus } from '../utils';

declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, code?: HttpStatus): Response;

      fail<E>(error: E | string, code?: HttpStatus): Response;
    }
  }
}

export function responseMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = <T>(data: T, code: HttpStatus = HttpStatus.OK): Response =>
    sendSuccess(res, data, code);

  res.fail = <E>(error: E | string, code?: HttpStatus): Response =>
    sendError(res, typeof error === 'string' ? error : (error as Error).message, code ?? HttpStatus.INTERNAL_SERVER_ERR, typeof error === 'object' && !(typeof error === 'string') ? error : undefined);
  next();
}
