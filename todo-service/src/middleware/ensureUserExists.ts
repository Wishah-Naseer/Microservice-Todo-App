import { Request, Response, NextFunction } from 'express';
import { fetchUserById, UserDto } from '../clients/userClient';
import { HttpStatus } from '../utils/httpStatusCodes';

export async function ensureUserExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // we know authMiddleware has already set req.userId
    const userId = (req as any).userId as string;
    if (!userId) {
        return res.fail('Missing authenticated userId', HttpStatus.UNAUTHORIZED);
    }

    try {
        const user: UserDto = await fetchUserById(userId);
        // attach to the request
        (req as any).user = user;
        return next();
    } catch {
        // if User Service returns 404 or network error
        return res.fail('User not found', HttpStatus.BAD_REQUEST);
    }
}
