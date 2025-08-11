import { IsString } from 'class-validator';

export class CreateTodoDto {
    @IsString() content!: string;
}

export class UpdateTodoDto {
    @IsString() content!: string;
}
