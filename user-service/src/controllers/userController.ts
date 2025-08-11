import { Request, Response } from 'express';
import { CreateUserDto } from './dtos';
import { userService } from '../services';
import { HttpStatus } from '../utils';
import { ValidateBody } from '../decorators';

export class UserController {
  @ValidateBody(CreateUserDto)
  async register(req: Request, res: Response) {
    const dto = req.body as CreateUserDto;
    const user = await userService.register(dto);
    return res.success({
      data: { id: user.id, email: user.email },
      statusCode: HttpStatus.CREATED
    });
  }

  @ValidateBody(CreateUserDto)
  async login(req: Request, res: Response) {
    const dto = req.body as CreateUserDto;
    const token = await userService.login(dto);
    return res.success({
      data: { token },
      statusCode: HttpStatus.OK
    });
  }

  async getById(req: Request, res: Response) {
    const user = await userService.findById(req.params.id);
    return res.success({ data: { id: user.id, email: user.email, createdAt: user.createdAt } });
    // return res.success({
    //   id: user.id,
    //   email: user.email,
    //   createdAt: user.createdAt
    // });
  }
}
