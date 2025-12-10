import { CrudUserService } from './../../users/services/crudUser.service';
import { MailsService } from './../../shared/services/mails.service';
import { MailTemplateService } from './../../shared/services/mail-template.service';
import { NOT_FOUND_RESPONSE } from './../../shared/constants/response.constant';
import { RecoveryPasswordBodyDto, RefreshTokenBodyDto } from '../dtos/auth.dto';
import {
  TokenPayloadModel,
  UserAuthModel,
} from '../models/authentication.model';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AccessSessionsService } from './accessSessions.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly _crudUserService: CrudUserService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _accessSessionsService: AccessSessionsService,
    private readonly _mailService: MailsService,
    private readonly _mailTemplateService: MailTemplateService,
  ) {}

  async signIn(credentials: Partial<UserAuthModel>) {
    const user = await this._crudUserService.findByParams({
      email: credentials.email,
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.roleType) {
      throw new UnauthorizedException('El usuario no tiene un rol asignado');
    }

    const hotelId = user.hotel?.id || null;

    const payload = {
      email: user.email,
      sub: user.id,
      id: user.id,
      hotelId,
    };

    const tokens = this.generateTokens(payload);

    const accessSessionId = await this._accessSessionsService.generateSession({
      userId: user.id,
      accessToken: tokens.accessToken,
      id: uuidv4(),
    });

    return {
      tokens: { ...tokens },
      user: {
        userId: user.id,
        roleType: {
          roleTypeId: user.roleType.id,
          name: user.roleType.name,
        },
        hotelId,
      },
      session: {
        accessSessionId,
      },
    };
  }

  async validateSession({
    userId,
    token,
    hotelId,
  }: {
    userId: string;
    token: string;
    hotelId?: string;
  }) {
    let payload;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      payload = this._jwtService.verify(token, {
        secret: this._configService.get<string>('jwt.secret'),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      throw new UnauthorizedException('No autorizado');
    }

    const user = await this._crudUserService.findByParams({ id: userId });

    if (!user) {
      throw new UnauthorizedException('No autorizado');
    }

    return {
      ...user,
      hotelId: hotelId ?? user.hotel?.id ?? null,
    };
  }

  generateTokens(payload: TokenPayloadModel): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this._jwtService.sign(payload, {
      expiresIn: this._configService.get('jwt.expiresIn'),
      secret: this._configService.get<string>('jwt.secret'),
    });

    const refreshToken = this._jwtService.sign(payload, {
      expiresIn: this._configService.get('jwt.refreshTokenExpiresIn'),
      secret: this._configService.get<string>('jwt.secret'),
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(body: RefreshTokenBodyDto) {
    let payload;

    try {
      payload = this._jwtService.verify(body.refreshToken, {
        secret: this._configService.get<string>('jwt.secret'),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      throw new UnauthorizedException('No autorizado');
    }

    const user = await this.validateSession({
      userId: payload.sub,
      token: body.refreshToken,
    });

    if (!user) {
      throw new UnauthorizedException('No autorizado');
    }

    const hotelId = user.hotel?.id || null;

    const tokens = this.generateTokens({
      email: user.email,
      id: user.id,
      sub: user.id,
      hotelId,
    });

    return {
      tokens: { ...tokens },
      user: {
        userId: user.id,
        role: {
          roleId: user.roleType.id,
          name: user.roleType.name,
        },
        hotelId,
      },
    };
  }

  async signOut({
    userId,
    accessToken,
    accessSessionId,
  }: {
    userId: string;
    accessToken: string;
    accessSessionId: string;
  }): Promise<void> {
    const sessionExists = await this._accessSessionsService.findOneByParams({
      userId,
      accessToken,
      id: accessSessionId,
    });

    if (!sessionExists) {
      throw new NotFoundException(NOT_FOUND_RESPONSE);
    }
    await this._accessSessionsService.delete(sessionExists.id, userId);
  }

  async recoveryPassword(body: RecoveryPasswordBodyDto) {
    const user = await this._crudUserService.findOneByParams(
      {
        where: { email: body.email },
      },
      false,
      false,
    );

    if (!user) {
      return;
    }
    const token: string = await this._crudUserService.generateResetToken(
      user.id,
    );
    if (user) {
      await this._mailService.sendEmail({
        to: user.email,
        subject: 'Recuperación de contraseña',
        body: this._mailTemplateService.recoveryPasswordTemplate(
          `https://samawe.netlify.app/auth/${user.id}/change-password`,
          user.firstName,
          token,
        ),
      });
    }
  }
}
