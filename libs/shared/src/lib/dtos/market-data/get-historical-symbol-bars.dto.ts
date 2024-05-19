import { IntersectionType } from '@nestjs/swagger';
import { GetBarsDto } from './get-bars.dto';
import { SymbolDto } from './symbol.dto';

export class GetHistoricalSymbolBarsDto extends IntersectionType(
  GetBarsDto,
  SymbolDto,
) {}
