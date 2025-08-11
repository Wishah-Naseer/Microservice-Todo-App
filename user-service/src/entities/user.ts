import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// User entity - represents a user account
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
