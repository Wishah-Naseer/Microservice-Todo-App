import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError, HttpStatus } from '../utils';

declare global {
  namespace Express {
    interface Response {
      //Send a 200 OK success envelope.
      // success<T>(data: T, code?: HttpStatus): Response;
      success<T>(args: SuccessArgs<T>): Response;

      // Send an error envelope. Defaults to 500.
      fail<E>(error: E | string, code?: HttpStatus): Response;
    }
  }
}

interface SuccessArgs<T> { data: T; statusCode?: HttpStatus; }

export function responseMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  // res.success = <T>(data: T, code: HttpStatus = HttpStatus.OK): Response =>
  //   sendSuccess(res, data, code);
  res.success = <T>({ data, statusCode }: SuccessArgs<T>): Response =>
    sendSuccess(res, data, statusCode);

  res.fail = <E>(error: E | string, code?: HttpStatus): Response =>
    sendError(res, typeof error === 'string' ? error : (error as Error).message, code ?? HttpStatus.INTERNAL_SERVER_ERR, typeof error === 'object' && !(typeof error === 'string') ? error : undefined);
  next();
}
