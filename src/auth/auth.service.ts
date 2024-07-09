import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
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

            // Return JWT token
            return this.signToken(user.id, user.email);
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
        return this.signToken(user.id, user.email);
    }

    private async signToken(
        userId: number,
        email: string
    ): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        };

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });

        return {
            access_token: token
        }
    }
}