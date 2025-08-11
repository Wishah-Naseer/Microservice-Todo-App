import { Repository } from 'typeorm';
import { HttpError }  from '../utils/HttpError';
import { HttpStatus } from '../utils/httpStatusCodes';
import { Todo } from '../entities';
import { AppDataSource } from '../dataSource';
import { CreateTodoDto, UpdateTodoDto } from '../controllers/dtos';

export class TodoService {
  private repo: Repository<Todo>;
  
  constructor() { 
    // Get TypeORM repository for Todo entity
    this.repo = AppDataSource.getRepository(Todo); 
  }

  // Create a new todo and associate it with the user
  async create(userId: string, dto: CreateTodoDto) {
    const todo = this.repo.create({ ...dto, userId });
    return this.repo.save(todo);
  }

  // Get all todos for a specific user
  async list(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  // Update a todo - only if it exists and belongs to the user
  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.repo.findOneBy({ id, userId });
    if (!todo) throw new HttpError('Not found', HttpStatus.NOT_FOUND);
    Object.assign(todo, dto);
    return this.repo.save(todo);
  }

  // Delete a todo - only if it exists and belongs to the user
  async remove(userId: string, id: string) {
    const result = await this.repo.delete({ id, userId });
    if (result.affected === 0) throw new HttpError('Not found', HttpStatus.NOT_FOUND);
  }
}
export const todoService = new TodoService();
