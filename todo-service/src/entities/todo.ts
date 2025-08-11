import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

// Todo entity - represents a user's todo item
@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  content!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
