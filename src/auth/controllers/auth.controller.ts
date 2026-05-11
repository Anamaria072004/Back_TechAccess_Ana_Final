import { Body, Controller, Get, Header, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );
        return this.authService.login(user);
    }

    @Get('check-status')
    @Header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate') // Evita que el navegador cachee esta respuesta
    @Header('Pragma', 'no-cache') // Para HTTP/1.0
    @Header('Expires', '0') // Para HTTP/1.0 y HTTP/1.1
    @UseGuards(JwtAuthGuard) // Usa el guard de JWT que ya configuraste
    checkStatus(@Request() req) {
    // req.user viene del Payload del JWT
    return this.authService.checkStatus(req.user); 
    }
}
