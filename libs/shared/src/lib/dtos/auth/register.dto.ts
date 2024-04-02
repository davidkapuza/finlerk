import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { RegisterRequestType } from '../../types';
import { lowerCaseTransformer } from '../../transformers/shared/lower-case.transformer';
import { Match } from '../../decorators/match.decorator';

export class RegisterDto implements RegisterRequestType {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Match('password')
  confirmPassword: string;

  @ApiProperty({ example: 'Jhon' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;
}
