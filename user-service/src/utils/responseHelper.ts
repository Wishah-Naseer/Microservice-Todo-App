import { Response } from 'express';
import { HttpStatus } from './httpStatusCodes';

interface SuccessPayload<T> {
  status: 'success';
  data: T;
  statusCode?: HttpStatus;
}

interface ErrorPayload {
  status: 'error';
  message: string;
  errors?: unknown;
}


//Sends a JSON success envelope with default 200 OK.
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: HttpStatus = HttpStatus.OK
): Response {
  const payload: SuccessPayload<T> = { status: 'success', data };
  return res.status(statusCode).json(payload);
}

//Sends a JSON error envelope. Defaults to 500 Internal Server Error.
export function sendError(
  res: Response,
  message: string,
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERR,
  errors?: unknown
): Response {
  const payload: ErrorPayload = { status: 'error', message, errors };
  return res.status(statusCode).json(payload);
}
