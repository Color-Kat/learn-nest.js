import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import { JwtGuard } from "../auth/guard";
import { BookmarkService } from "./bookmark.service";
import { GetUser } from "../auth/decorator";
import { CreateBookmarkDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(
        private bookmarkService: BookmarkService
    ) {
    }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        // return 123;
        return this.bookmarkService.getBookmarks(
            userId
        );
    }

    @Get('/:bookmarkId')
    getBookmarksById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.getBookmarkById(
            userId,
            bookmarkId
        );
    }

    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.createBookmark(
            userId,
            dto
        );
    }

    @Patch(':bookmarkId')
    editBookmarkById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.editBookmarkById(
            userId,
            bookmarkId,
            dto
        );
    }

    @Delete('/:bookmarkId')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('bookmarkId', ParseIntPipe) bookmarkId: number
    ) {
        return this.bookmarkService.deleteBookmarkById(
            userId,
            bookmarkId
        );
    }
}
