import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/user.service';
import { JwtPayload } from '../interfaces/payload.jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Here, you can implement the logic to validate the JWT payload
    // and retrieve the corresponding user from the database.
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      // If the user is not found, you can throw an exception or return false to deny access.
      // For example:
      throw new UnauthorizedException();
    }
    return user;
  }
}
