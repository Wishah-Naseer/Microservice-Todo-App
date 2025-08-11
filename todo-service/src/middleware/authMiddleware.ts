import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpStatusCodes';
import { UserDto } from '../clients';

// Extend Request interface to include user info
export interface AuthRequest extends Request {
    userId?: string;
    user?: UserDto;
}

// Middleware to verify JWT token and extract user ID
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Check for Authorization header with Bearer token
    const header = req.header('Authorization');
    if (!header?.startsWith('Bearer ')) {
        return res.fail('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED);
    }

    // Extract token from "Bearer <token>"
    const token = header.slice(7);
    let payload: JwtPayload;
    
    try {
        // Verify JWT token
        const verified = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof verified === 'string') {
            return res.fail('Invalid token payload', HttpStatus.UNAUTHORIZED);
        }
        payload = verified;
    } catch {
        return res.fail('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    // Extract user ID from token subject
    const sub = payload.sub;
    if (typeof sub !== 'string') {
        return res.fail('Invalid subject in token', HttpStatus.UNAUTHORIZED);
    }

    // Attach user ID to request for downstream handlers
    (req as AuthRequest).userId = sub;
    next();
}
