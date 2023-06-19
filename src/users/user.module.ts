import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { UserSchema, User } from './entity/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../auth-middleware/jwt-strategy';
import { PassportModule } from "@nestjs/passport";
import { Task, TaskSchema } from 'src/tasks/entity/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   PassportModule,ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`
        },
      }),
    }),
    ConfigModule.forRoot(),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModule {}
