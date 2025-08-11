import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error(err);

    if (err instanceof HttpError) {
        return res.fail(err.message, err.statusCode);
    }

    return res.fail('Internal server error');
}
