import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Asset, GetBarsDto, GetNewsDto, QueryAssetsDto } from '@finlerk/shared';
import { MarketDataService } from './market-data.service';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Market data')
@Controller({
  path: 'market-data',
  version: '1',
})
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600)
  @Get('news')
  @HttpCode(HttpStatus.OK)
  getNews(
    @Query()
    getNewsDto: GetNewsDto,
  ) {
    return this.marketDataService.getNews(getNewsDto);
  }

  @Get('assets')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryAssetsDto): Promise<Array<Asset>> {
    const globalFilter = query.globalFilter;
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return await this.marketDataService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
      globalFilter,
    });
  }

  @Get('stocks-bars')
  @HttpCode(HttpStatus.OK)
  getStockBars(@Query() getBarsDto: GetBarsDto) {
    return this.marketDataService.getStocksBars(getBarsDto);
  }

  @Get('most-active')
  @HttpCode(HttpStatus.OK)
  mostActive() {
    return this.marketDataService.mostActives();
  }
}
