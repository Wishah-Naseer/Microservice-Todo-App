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
        await AppDataSource.initialize();
        console.log('Data source has been initialized');

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(responseMiddleware);

        app.use('/user', userRouter);

        app.get('/', (_req: Request, res: Response) =>
            res.success({ data: { message: 'User Service is running' } })
        );

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

