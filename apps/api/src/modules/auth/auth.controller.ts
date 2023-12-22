import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthServiceInterface } from './interface/auth-service.interface';
import { LoginResponseType } from './types/login-response.type';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: RegisterDto): Promise<void> {
    return this.authService.register(createUserDto);
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
  public login(@Body() loginDto: LoginDto): Promise<LoginResponseType> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {
    return this.authService.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
  }
}
