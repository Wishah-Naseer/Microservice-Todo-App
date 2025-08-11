import { Request, Response, NextFunction } from 'express';
import { fetchUserById, UserDto } from '../clients/userClient';
import { HttpStatus } from '../utils/httpStatusCodes';

// Middleware to verify that the authenticated user exists in the user service
export async function ensureUserExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Get userId from auth middleware
    const userId = (req as any).userId as string;
    if (!userId) {
        return res.fail('Missing authenticated userId', HttpStatus.UNAUTHORIZED);
    }

    try {
        // Fetch user details from user service to verify existence
        const user: UserDto = await fetchUserById(userId);
        (req as any).user = user;
        return next();
    } catch {
        return res.fail('User not found', HttpStatus.BAD_REQUEST);
    }
}
