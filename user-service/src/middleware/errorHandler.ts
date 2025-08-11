import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError';

//Global error handler. Catches any error thrown in routes/controllers.

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

    // fallback for unhandled exceptions
    return res.fail('Internal server error');
}
