import { Delete, ForbiddenException, Get, Injectable, Patch, Post } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookmarkService {
    constructor(
        private prisma: PrismaService
    ) {
    }

    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {userId}
        })
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = this.prisma.bookmark.findUnique({
            where: {id: bookmarkId, userId}
        });

        return bookmark;
    }

    createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            }
        });

        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.getBookmarkById(userId, bookmarkId);

        if(!bookmark) {
            throw new ForbiddenException('Access to the resource denied');
        }

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.getBookmarkById(userId, bookmarkId);

        if(!bookmark) {
            throw new ForbiddenException('Access to the resource denied');
        }

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        });
    }
}
