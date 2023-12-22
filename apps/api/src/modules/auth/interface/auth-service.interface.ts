import { LoginDto } from '@auth/dtos/login.dto';
import { RegisterDto } from '@auth/dtos/register.dto';
import { JwtRefreshPayloadType } from '@auth/strategies/types/jwt-refresh-payload.type';
import { LoginResponseType } from '@auth/types/login-response.type';
import { UpdateResult } from 'typeorm';

export interface AuthServiceInterface {
  register(dto: RegisterDto): Promise<void>;
  confirmEmail(hash: string): Promise<void>;
  login(loginDto: LoginDto): Promise<LoginResponseType>;
  refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>>;
  logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<UpdateResult>;
}
