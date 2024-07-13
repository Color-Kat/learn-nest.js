import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";

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
        await app.listen(3333);

        // Get prisma service to use it everywhere in test.
        prisma = app.get(PrismaService);
        await prisma.cleanDB();

        // Set up pactum
        pactum.request.setBaseUrl('http://localhost:3333');
    });

    afterAll(() => {
        app.close();
    });

    it.todo('should pass');

    const authDto: AuthDto = {
        email: 'a@a.com',
        password: '123'
    };

    describe('Auth', () => {
        describe('Sign up', () => {
            it('should throw error if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ ...authDto, email: '' })
                    .expectStatus(400)
                    ;
            });

            it('should throw error if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .expectStatus(400)
                    ;
            });

            it('should throw error if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ ...authDto, password: '' })
                    .expectStatus(400)
                    ;
            });

            it('should sign up', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(authDto)
                    .expectStatus(201)
                    ;
            });
        });

        describe('Sign in', () => {
            let accessToken: string;

            it('should throw error if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ ...authDto, email: '' })
                    .expectStatus(400)
                    ;
            });

            it('should throw error if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .expectStatus(400)
                    ;
            });

            it('should throw error if no body provided', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ ...authDto, password: '' })
                    .expectStatus(400)
                    ;
            });

            it('should sign in', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody(authDto)
                    .expectStatus(200)
                    .stores('userAccessToken', 'access_token') // Get it from the returned body
                    ;
            });
        });
    });

    describe('User', () => {
        describe('Get me', () => {
            it('should get current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: `Bearer $S{userAccessToken}`
                    })
                    .expectStatus(200)
                ;
            })
        });

        describe('Edit user', () => {
            it('Should edit user', () => {
                const editUserDto: EditUserDto = {
                    email: 'b@b.com',
                    firstName: 'b',
                    lastName: 'b'
                }
                return pactum
                    .spec()
                    .patch('/users/edit-user')
                    .withHeaders({
                        Authorization: `Bearer $S{userAccessToken}`
                    })
                    .withBody(editUserDto)
                    .expectStatus(200)
                    .expectBodyContains(editUserDto.email)
                    .expectBodyContains(editUserDto.firstName)
                    .expectBodyContains(editUserDto.lastName)
                    ;
            });
        });
    });

    describe('Bookmark', () => {
        describe('Create bookmark', () => {

        });

        describe('Get bookmarks', () => {

        });

        describe('Get bookmark by id', () => {

        });

        describe('Edit bookmark by id', () => {

        });

        describe('Delete bookmark by id', () => {

        });
    });
});