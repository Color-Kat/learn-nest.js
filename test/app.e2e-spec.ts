import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { PrismaService } from "../src/prisma/prisma.service";

describe('App e2e', () => {
    let app: NestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        // Compile the code that must be tested
        const moduleRef = await Test.createTestingModule(({
            imports: [AppModule]
        })).compile();

        // Create the NestJS application
        app = moduleRef.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true // remove fields that are not in dto
        }));

        await app.init();

        // Get prisma service to use it everywhere in test.
        prisma = app.get(PrismaService);
        await prisma.cleanDB();
    });

    afterAll(() => {
        app.close();
    });

    it.todo('should pass');

    describe('Auth', () => {
        describe('Sign up', () => {

        });

        describe('Sign in', () => {

        });
    });

    describe('User', () => {
        describe('Get me', () => {

        });

        describe('Edit user', () => {

        });
    });

    describe('Bookmark', () => {
        describe('Create bookmark', () => {

        });

        describe('Get bookmarks', () => {

        });

        describe('Get bookmark by id', () => {

        });

        describe('Edit bookmark', () => {

        });

        describe('Delete bookmark', () => {

        });
    });
});