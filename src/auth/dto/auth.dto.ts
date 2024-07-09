import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsEmail({},{message: 'Почта неверная'})
    @IsNotEmpty({message: 'Почта не указана'})
    email: string;

    @IsString({message: 'Пароль должен быть строкой'})
    @IsNotEmpty({message: 'Пароль не указан'})
    password: string
}