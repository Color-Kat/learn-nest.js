import { Delete, Get, Injectable, Patch, Post } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {
    getBookmarks(userId: number) {
        return 'Get bookmarks';
    }

    getBookmarksById(userId: number, bookmarkId: number) {
        return 'Get bookmark by id';
    }

    createBookmark(userId: number, dto: CreateBookmarkDto) {
        return 'Create bookmark';
    }

    editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        return 'Edit bookmark by id';
    }

    deleteBookmarkById(userId: number, bookmarkId: number) {
        return 'Delete bookmark by id';
    }
}
