import { TokensCookieOptionsInterface } from '@/shared/interfaces/tokens-cookie-options.inerface';
import { AuthGoogleLoginDto, User } from '@finlerk/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
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
    @Inject('TOKENS_COOKIE_OPTIONS')
    private readonly tokensCookieOptions: TokensCookieOptionsInterface,
  ) {}

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
      .cookie(
        'access_token',
        accessToken,
        this.tokensCookieOptions.accessTokenCookieOptions,
      )
      .cookie(
        'refresh_token',
        refreshToken,
        this.tokensCookieOptions.refreshTokenCookieOptions,
      );

    return user;
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get('login-url')
  @HttpCode(HttpStatus.OK)
  async getAuthUrl(): Promise<{ url: string }> {
    return await this.authGoogleService.getAuthUrl();
  }
}
