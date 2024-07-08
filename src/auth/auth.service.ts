import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService
    ) {

    }

    singup() {
        return 'I am signed up';
    }

    signin() {
        return 'I am signed in';
    }
}