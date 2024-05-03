import { TokensCookieOptionsInterface } from '@/shared/interfaces/tokens-cookie-options.inerface';
import {
  ConfirmEmailDto,
  EmailLoginDto,
  RegisterDto,
  User,
} from '@finlerk/shared';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('TOKENS_COOKIE_OPTIONS')
    private readonly tokensCookieOptions: TokensCookieOptionsInterface,
  ) {}

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
