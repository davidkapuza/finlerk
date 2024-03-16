import { lowerCaseTransformer } from '@/shared/transformers/lower-case.transformer';
import { DoesExist } from '@/shared/validators/does-exist.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Validate } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(DoesExist, ['UserEntity'], {
    message: 'emailDoesNotExists',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
