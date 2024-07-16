import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SubscribeToBarsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  bars: string[];
}
