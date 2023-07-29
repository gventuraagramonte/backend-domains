import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      }
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    // Modulo asincrono
    JwtModule.registerAsync({
      imports: [ ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })

    // Modulo sincrono, pero muchas veces no se
    // carga hasta despues del despliegue
    // JwtModule.register({
    //   secret: 'cxxfefdsfweddgf',
    //   signOptions: {
    //     expiresIn: '1h'
    //   }
    // })
  ],
  exports: [
    MongooseModule,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})
export class AuthModule {}
