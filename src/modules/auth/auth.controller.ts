import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerificationDto } from './dto/dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    register(@Body() payload: RegisterDto){
        return this.authService.register(payload)
    }

    @Post('login')
    login(@Body() payload: LoginDto){
        return this.authService.login(payload)
    }

    @Post('verify')
    verify(@Body() payload: VerificationDto){
        return this.authService.verify(payload)
    }
}
