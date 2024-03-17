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
import { User } from '@qbick/shared';
import { CookieOptions, Response } from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailLoginDto } from './dtos/email-login.dto';
import { RegisterDto } from './dtos/register.dto';

const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(ms(process.env.AUTH_JWT_TOKEN_EXPIRES_IN)),
  maxAge: ms(process.env.AUTH_JWT_TOKEN_EXPIRES_IN),
  httpOnly: true,
  sameSite: 'lax',
};
const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(ms(process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN)),
  maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN),
  httpOnly: true,
  sameSite: 'lax',
};
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.register(registerDto);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto): Promise<void> {
    return this.authService.confirmEmail(confirmEmailDto.hash);
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
    const { accessToken, refreshToken, tokenExpires, user } =
      await this.authService.login(loginDto);
    res
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .cookie('tokenExpires', tokenExpires, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });
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
    const { accessToken, refreshToken, tokenExpires } =
      await this.authService.refreshToken({
        sessionId: request.user.sessionId,
        hash: request.user.hash,
      });
    res
      .cookie('accessToken', accessToken, accessTokenCookieOptions)
      .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
      .cookie('tokenExpires', tokenExpires, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });
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
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .clearCookie('tokenExpires');
  }
}
