import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGoogleLoginDto, User } from '@finlerk/shared';
import { CookieOptions, Response } from 'express';
import ms from 'ms';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../shared/dtos/login-response.dto';
import { AuthGoogleService } from './auth-google.service';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  accessTokenCookieOptions: CookieOptions;
  refreshTokenCookieOptions: CookieOptions;
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
    private readonly configService: ConfigService,
  ) {
    const accessExpires = ms(
      this.configService.getOrThrow<string>('auth.accessExpires', {
        infer: true,
      }),
    );
    const refreshExpires = ms(
      this.configService.getOrThrow<string>('auth.refreshExpires', {
        infer: true,
      }),
    );

    this.accessTokenCookieOptions = {
      expires: new Date(Date.now() + accessExpires),
      maxAge: accessExpires,
      httpOnly: true,
      sameSite: 'lax',
    };
    this.refreshTokenCookieOptions = {
      expires: new Date(Date.now() + refreshExpires),
      maxAge: refreshExpires,
      httpOnly: true,
      sameSite: 'lax',
    };
  }

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthGoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const socialData = await this.authGoogleService.getProfile(loginDto);

    const { accessToken, refreshToken, user } =
      await this.authService.validateSocialLogin('google', socialData);

    res
      .cookie('access_token', accessToken, this.accessTokenCookieOptions)
      .cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    return user;
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('login-url')
  @HttpCode(HttpStatus.OK)
  async getAuthUrl(): Promise<string> {
    return await this.authGoogleService.getAuthUrl();
  }
}
