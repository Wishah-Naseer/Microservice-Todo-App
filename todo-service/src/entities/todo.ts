import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() content!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn() createdAt!: Date;
}
