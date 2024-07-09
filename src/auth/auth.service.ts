import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
    ) {

    }

    async singup(dto: AuthDto) {
        // Generate the password hash
        const hash = await argon.hash(dto.password);

        // Save the new user to the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                },
                // Not handy
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true
                // }
            });

            delete user.hash;

            // Return the saved user
            return user;
        } catch (error) {
            if (error.code === 'P2002' && error instanceof PrismaClientKnownRequestError) {
                throw new ForbiddenException(['Такой email уже используется']);
            }

            throw error;
        }
    }

    async signin(dto: AuthDto) {
        // Find the user by email
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        // If user does not exist
        if(!user) throw new ForbiddenException(['Такого пользователя не существует']);

        // Compare passwords
        const passwordMatches = await argon.verify(user.hash, dto.password);

        // If password incorrect
        if(!passwordMatches) throw new ForbiddenException(['Неверный пароль']);

        // Send back to the user
        delete user.hash;
        return user;
    }
}