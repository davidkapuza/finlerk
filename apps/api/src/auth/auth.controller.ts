import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import {
  ConfirmEmailDto,
  EmailLoginDto,
  RegisterDto,
  User,
} from '@finlerk/shared';
import { CookieOptions, Response } from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '@/shared/config/config.type';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  accessTokenCookieOptions: CookieOptions;
  refreshTokenCookieOptions: CookieOptions;
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<ConfigType>,
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

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.confirmEmail(
      confirmEmailDto.hash,
    );
    res
      .cookie('access_token', accessToken, this.accessTokenCookieOptions)
      .cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: EmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto,
    );
    res
      .cookie('access_token', accessToken, this.accessTokenCookieOptions)
      .cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
    return user;
  }

  @ApiCookieAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async refresh(
    @Request() request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    });

    res
      .cookie('access_token', accessToken, this.accessTokenCookieOptions)
      .cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
  }

  @ApiCookieAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @Request() request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
    res.clearCookie('access_token').clearCookie('refresh_token');
  }
}
