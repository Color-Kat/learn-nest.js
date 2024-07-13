import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "../src/bookmark/dto";

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
                    .inspect()
                ;
            })
        });

        describe('Edit user', () => {
            const editUserDto: EditUserDto = {
                email: 'b@b.com',
                firstName: 'b',
                lastName: 'b'
            }

            it('Should edit user', () => {
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

            // To prevent user's logout
            it('should resign in', () => {
                return pactum
                    .spec()
                    .post('/auth/signin')
                    .withBody({ ...authDto, ...editUserDto })
                    .expectStatus(200)
                    .stores('userAccessToken', 'access_token') // Get it from the returned body
                    ;
            });
        });
    });

    describe('Bookmark', () => {
        describe('Get empty bookmarks', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
                    .expectStatus(200)
                    .expectBody([])
                    ;
            })
        });

        const createBookmarkDto: CreateBookmarkDto = {
            title: 'Test title',
            description: 'Test description',
            link: 'Test link'
        };

        describe('Create bookmark', () => {
            it('should create a bookmark', () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
                    .withBody(createBookmarkDto)
                    .expectStatus(201)
                    .stores('bookmarkId', 'id') // Get id from the returned body
                    ;
            })
        });

        describe('Get bookmarks', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
                    .expectStatus(200)
                    .expectBodyContains(createBookmarkDto.title)
                    .expectJsonLength(1) // Only one created bookmark in the response
                    ;
            })
        });

        describe('Get bookmark by id', () => {
            it('should get bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks/$S{bookmarkId}')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
                    .expectStatus(200)
                    .expectBodyContains(createBookmarkDto.title)
                    ;
            });
        });

        describe('Edit bookmark by id', () => {
            it('should edit bookmark', () => {
                const editBookmarkDto: EditBookmarkDto = {
                    title: 'Test title 2',
                    description: 'Test description 2',
                    link: 'Test link 2'
                };

                return pactum
                    .spec()
                    .patch('/bookmarks/$S{bookmarkId}')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}`})
                    .withBody(editBookmarkDto)
                    .expectStatus(200)
                    .expectBodyContains(editBookmarkDto.title)
                    ;
            });
        });

        describe('Delete bookmark by id', () => {
            it('should delete bookmark', () => {
               return pactum
                    .spec()
                    .delete('/bookmarks/$S{bookmarkId}')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}`})
                    .expectStatus(204)
                    ;
            });

            it('should get empty bookmarks', () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({ Authorization: `Bearer $S{userAccessToken}` })
                    .expectStatus(200)
                    .expectBody([])
                    ;
            })
        });
    });
});