import { Repository } from 'typeorm';
import { HttpError }  from '../utils/HttpError';
import { HttpStatus } from '../utils/httpStatusCodes';
import { Todo } from '../entities';
import { AppDataSource } from '../dataSource';
import { CreateTodoDto, UpdateTodoDto } from '../controllers/dtos';

export class TodoService {
  private repo: Repository<Todo>;
  constructor() { this.repo = AppDataSource.getRepository(Todo); }

  async create(userId: string, dto: CreateTodoDto) {
    const todo = this.repo.create({ ...dto, userId });
    return this.repo.save(todo);
  }

  async list(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    const todo = await this.repo.findOneBy({ id, userId });
    if (!todo) throw new HttpError('Not found', HttpStatus.NOT_FOUND);
    Object.assign(todo, dto);
    return this.repo.save(todo);
  }

  async remove(userId: string, id: string) {
    const result = await this.repo.delete({ id, userId });
    if (result.affected === 0) throw new HttpError('Not found', HttpStatus.NOT_FOUND);
  }
}
export const todoService = new TodoService();
