import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { TodoController } from '../controllers';
import { asyncHandler, ensureUserExists } from '../middleware';

const todoRouter = Router();
const ctrl = new TodoController();

// Apply authentication and user verification to all todo routes
todoRouter.use(authMiddleware, ensureUserExists);

// Todo CRUD endpoints
todoRouter.post('/', asyncHandler(ctrl.create.bind(ctrl)));
todoRouter.get('/', asyncHandler(ctrl.list.bind(ctrl)));
todoRouter.put('/:id', asyncHandler(ctrl.update.bind(ctrl)));
todoRouter.delete('/:id', asyncHandler(ctrl.remove.bind(ctrl)));

export { todoRouter };
