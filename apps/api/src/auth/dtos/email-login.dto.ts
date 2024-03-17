import { lowerCaseTransformer } from '@/shared/transformers/lower-case.transformer';
import { DoesExist } from '@/shared/validators/does-exist.validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Validate } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(DoesExist, ['UserEntity'], {
    message: 'emailDoesNotExists',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
