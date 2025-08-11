import { Request, Response } from 'express';
import { ValidateBody } from '../decorators';
import { CreateTodoDto, UpdateTodoDto } from './dtos';
import { HttpStatus } from '../utils';
import { todoService } from '../services';
import { AuthRequest } from '../middleware';

export class TodoController {
  @ValidateBody(CreateTodoDto)
  async create(req: AuthRequest, res: Response) {
    const todo = await todoService.create(req.userId!, req.body);
    return res.success(todo, HttpStatus.CREATED);
  }

  async list(req: AuthRequest, res: Response) {
    const todos = await todoService.list(req.userId!);
    return res.success(todos);
  }

  @ValidateBody(UpdateTodoDto)
  async update(req: AuthRequest, res: Response) {
    const todo = await todoService.update(
      req.userId!, req.params.id, req.body
    );
    return res.success(todo);
  }

  async remove(req: AuthRequest, res: Response) {
    await todoService.remove(req.userId!, req.params.id);
    return res.success(null, HttpStatus.NO_CONTENT);
  }
}
