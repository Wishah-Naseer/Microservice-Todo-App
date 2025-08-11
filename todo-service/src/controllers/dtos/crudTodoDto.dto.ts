import { IsString } from 'class-validator';

// Data transfer object for creating a new todo
export class CreateTodoDto {
    @IsString() content!: string;
}

// Data transfer object for updating an existing todo
export class UpdateTodoDto {
    @IsString() content!: string;
}
