import { plainToInstance } from 'class-transformer';
import {
    validateOrReject,
    ValidationError,
} from 'class-validator';
import {
    Request,
    Response,
    NextFunction,
} from 'express';
import { HttpStatus } from '../utils';

// Decorator to validate request body against a DTO class
export function ValidateBody(dtoClass: new () => any): MethodDecorator {
    return (
        target: Object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void => {
        const originalMethod = descriptor.value!;

        // Wrap the original method with validation logic
        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<any> {
            // Convert request body to DTO instance
            const dtoObject = plainToInstance(dtoClass, req.body);

            try {
                // Validate the DTO object
                await validateOrReject(dtoObject, {
                    whitelist: true,
                    forbidNonWhitelisted: true,
                });
                req.body = dtoObject;
            } catch (err) {
                // Handle validation errors
                if (Array.isArray(err)) {
                    const formatted = (err as ValidationError[]).map((e) => ({
                        property: e.property,
                        constraints: e.constraints,
                    }));
                    return res
                        .status(HttpStatus.BAD_REQUEST)
                        .json({
                            status: 'error',
                            message: 'Validation failed',
                            errors: formatted,
                        });
                }
                return next(err);
            }

            // Call the original method if validation passes
            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
