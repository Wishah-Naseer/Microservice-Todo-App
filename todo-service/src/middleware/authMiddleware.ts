import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpStatusCodes';
import { UserDto } from '../clients';

export interface AuthRequest extends Request {
    userId?: string;
    user?: UserDto;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        return res.fail('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED);
    }

    const token = header.slice(7);
    let payload: JwtPayload;
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof verified === 'string') {
            return res.fail('Invalid token payload', HttpStatus.UNAUTHORIZED);
        }
        payload = verified;
    } catch {
        return res.fail('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    const sub = payload.sub;
    if (typeof sub !== 'string') {
        return res.fail('Invalid subject in token', HttpStatus.UNAUTHORIZED);
    }

    (req as AuthRequest).userId = sub;
    next();
}
