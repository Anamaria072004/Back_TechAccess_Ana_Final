import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/features/users/entities/user.entity';
import { UsersService } from 'src/features/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/features/users/interfaces/user';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        // Eliminamos el Repository si no se usa directamente aquí
    ) { }

    async validateUser(email: string, password: string) {
        // Buscamos al usuario incluyendo sus roles para el login
        const user = await this.usersService.findByEmail(email);

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Extraemos el password para no enviarlo al frontend
        const { password: _, ...result } = user;
        return result;
    }

    async login(user: UserModel) {
        const payload = {
            sub: user.id,
            email: user.email,
            // Importante: Asegúrate de que user.roles exista en el objeto user
            // roles: user.roles ? user.roles.map(r => r.name) : [],
        };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async checkStatus(user: UserModel) {

        const id = user.id; // 'sub' es el campo que usamos para el ID del usuario en el payload
        const dbUser = await this.usersService.findOne(id);
        // Usamos 'sub' para que la estrategia pueda encontrarlo después
        const payload = {
            sub: dbUser.id,
            email: dbUser.email
        };

        return {
            user: dbUser,
            access_token: this.jwtService.sign(payload), // Generamos el token con 'sub'
        };
    }

}

