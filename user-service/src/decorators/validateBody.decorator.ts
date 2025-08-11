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

export function ValidateBody(dtoClass: new () => any): MethodDecorator {
    return (
        target: Object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void => {
        const originalMethod = descriptor.value!;

        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<any> {
            // Transform plain JSON into your DTO class
            const dtoObject = plainToInstance(dtoClass, req.body);

            try {
                // Run class-validator checks
                await validateOrReject(dtoObject, {
                    whitelist: true,
                    forbidNonWhitelisted: true,
                });
                // Replace body with the validated DTO
                req.body = dtoObject;
            } catch (err) {
                // If it's an array of ValidationError, format and return 400
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
                // Otherwise, pass it along (e.g. HttpError or unexpected)
                return next(err);
            }

            // All good — invoke the original controller
            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
