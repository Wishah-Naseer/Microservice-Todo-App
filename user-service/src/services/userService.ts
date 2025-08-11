import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/user';
import { HttpError } from '../utils/HttpError';
import { HttpStatus } from '../utils/httpStatusCodes';

export interface RegisterInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export class UserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    /**
     * Registers a new user.
     * @throws HttpError(409) if email already exists
     */
    async register(input: RegisterInput): Promise<User> {
        const { email, password } = input;

        const existing = await this.userRepository.findOneBy({ email });
        if (existing) {
            throw new HttpError('Email already in use', HttpStatus.CONFLICT);
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({ email, passwordHash });
        return this.userRepository.save(user);
    }

    /**
     * Logs in a user, returning a JWT.
     * @throws HttpError(401) on invalid credentials
     */
    async login(input: LoginInput): Promise<string> {
        const { email, password } = input;

        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new HttpError('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new HttpError('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }

        return jwt.sign(
            { sub: user.id, email: user.email },
            secret,
            { expiresIn: '1h' }
        );
    }

    async findById(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new HttpError('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}

export const userService = new UserService();
