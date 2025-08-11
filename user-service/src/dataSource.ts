import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/user';

// Database connection configuration for TypeORM
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT! || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: true,
});
