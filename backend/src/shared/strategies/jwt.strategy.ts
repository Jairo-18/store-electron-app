import { AuthService } from './../../auth/services/auth.service';
import { TokenPayloadModel } from './../../auth/models/authentication.model';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req,
    payload: TokenPayloadModel,
  ): Promise<Omit<User, 'password'>> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    const user = await this.authService.validateSession({
      userId: payload.sub,
      token,
      hotelId: payload.hotelId || null,
    });

    if (!user) {
      throw new UnauthorizedException('No autorizado');
    }
    if (!user.hotelId) {
      throw new UnauthorizedException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
      );
    }
    return user;
  }
}
