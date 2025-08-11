import { Request, Response, NextFunction } from 'express';
import { fetchUserById, UserDto } from '../clients/userClient';
import { HttpStatus } from '../utils/httpStatusCodes';

export async function ensureUserExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = (req as any).userId as string;
    if (!userId) {
        return res.fail('Missing authenticated userId', HttpStatus.UNAUTHORIZED);
    }

    try {
        const user: UserDto = await fetchUserById(userId);
        (req as any).user = user;
        return next();
    } catch {
        return res.fail('User not found', HttpStatus.BAD_REQUEST);
    }
}
