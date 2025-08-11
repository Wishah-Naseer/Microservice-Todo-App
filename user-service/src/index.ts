import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './dataSource';
import { userRouter } from './routes';
import { responseMiddleware } from './middleware/responseMiddleware';
import cors from 'cors';
import { errorHandler } from './middleware';

dotenv.config();

async function bootstrap() {
    try {
        // Initialize TypeORM
        await AppDataSource.initialize();
        console.log('Data source has been initialized');

        const app = express();

        // Global middleware
        app.use(cors());
        app.use(express.json());
        app.use(responseMiddleware);

        // Mount routes
        app.use('/user', userRouter);

        // Health check
        app.get('/', (_req: Request, res: Response) =>
            // res.success({ message: 'User Service is running' })
            res.success({ data: { message: 'User Service is running' } })
        );

        // Global error handler
        app.use(errorHandler);

        const port = process.env.PORT ?? 4000;
        app.listen(port, () =>
            console.log(`User Service listening on port ${port}`)
        );
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

bootstrap();

