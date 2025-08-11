import 'reflect-metadata';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './dataSource';
import { userRouter } from './routes';
import { responseMiddleware } from './middleware/responseMiddleware';
import cors from 'cors';
import { errorHandler } from './middleware';

// Load environment variables
dotenv.config();

// Main server bootstrap function
async function bootstrap() {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Data source has been initialized');

        const app = express();

        // Setup middleware
        app.use(cors());
        app.use(express.json());
        app.use(responseMiddleware);

        // Register API routes
        app.use('/user', userRouter);

        // Health check endpoint
        app.get('/', (_req: Request, res: Response) =>
            res.success({ data: { message: 'User Service is running' } })
        );

        // Global error handler (must be last)
        app.use(errorHandler);

        // Start server
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

