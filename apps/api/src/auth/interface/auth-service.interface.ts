import { UpdateResult } from 'typeorm';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseType } from '@qbick/shared';
import { JwtRefreshPayloadType } from '../strategies/types/jwt-refresh-payload.type';

export interface AuthServiceInterface {
  register(dto: RegisterDto): Promise<void>;
  confirmEmail(hash: string): Promise<void>;
  login(loginDto: LoginDto): Promise<LoginResponseType>;
  refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>>;
  logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<UpdateResult>;
}
