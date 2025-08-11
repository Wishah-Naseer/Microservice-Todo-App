import { IsEmail, IsString, Length } from 'class-validator';

// Data transfer object for user registration and login
export class CreateUserDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email!: string;

    @IsString({ message: 'Password must be a string' })
    @Length(6, 32, {
        message: 'Password must be between $constraint1 and $constraint2 characters',
    })
    password!: string;
}
