import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(
       @Body() dto: AuthDto,
    ) {
        console.log({dto});
        return this.authService.singup();
    }

    // signup(@Req() req: Request) // It's bad because we can switch to fastify and everything will break :(

    @Post('signin')
    signin() {
        return this.authService.signin();
    }
}