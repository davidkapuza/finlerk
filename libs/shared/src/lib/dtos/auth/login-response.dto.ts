import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../domains';

export class LoginResponseDto {
  @ApiResponseProperty()
  token: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty()
  tokenExpires: number;

  @ApiResponseProperty({
    type: () => User,
  })
  user: User;
}
