import { ApiResponseProperty } from '@nestjs/swagger';
import { LoginResponseType, User } from '@qbick/shared';

export class LoginResponseDto implements LoginResponseType {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;

  @ApiResponseProperty({
    type: () => User,
  })
  user: User;
}
