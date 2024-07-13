import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from "../auth/guard";

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    @Get('')
    getBookmarks() {
        return 'Get bookmarks';
    }

    @Get('')
    getBookmarksById() {
        return 'Get bookmark by id';
    }

    @Post('')
    createBookmark() {
        return 'Create bookmark';
    }

    @Patch('')
    editBookmarkById() {
        return 'Edit bookmark by id';
    }

    @Delete('')
    deleteBookmarkById() {
        return 'Delete bookmark by id';
    }
}
