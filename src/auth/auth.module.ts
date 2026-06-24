import { Module } from '@nestjs/common';
import { AuthService } from '../auth/services/auth.service';
import { AuthController } from '../auth/controllers/auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigType } from '@nestjs/config';
import config from '../config';
import { ModulesGuard } from './guards/modules.guard.guard';
import { JwtAuthGuard } from './guards/auth.guard';

import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    
    // Configuración dinámica del Mailer
    MailerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configType: ConfigType<typeof config>) => ({
        transport: {
          host: configType.email.host,
          port: configType.email.port,
          secure: false,
          auth: {
            user: configType.email.user,
            pass: configType.email.pass,
          },
        },
        defaults: {
          from: `"TechAccess Support" <${configType.email.user}>`,
        },
      }), 
    }), 
    
    // Configuración del JWT
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configType: ConfigType<typeof config>) => ({
        secret: configType.jwt.secret,
        signOptions: { expiresIn: `${configType.jwt.expiresIn}s` },
      }),
    }),
  ],
  providers: [AuthService, ModulesGuard, JwtAuthGuard, JwtStrategy], 
  controllers: [AuthController],
  exports: [AuthService, ModulesGuard, JwtAuthGuard],
})
export class AuthModule {}