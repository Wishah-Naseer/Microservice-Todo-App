import { Router } from 'express';
import { UserController } from '../controllers';
import { asyncHandler } from '../middleware';

const userRouter = Router();
const ctrl = new UserController();

// User authentication endpoints
userRouter.post(
    '/register',
    asyncHandler(ctrl.register.bind(ctrl))
);
userRouter.post(
    '/login',
    asyncHandler(ctrl.login.bind(ctrl))
);

// Get user details by ID
userRouter.get('/:id',
    asyncHandler(ctrl.getById.bind(ctrl))
);

export { userRouter };
