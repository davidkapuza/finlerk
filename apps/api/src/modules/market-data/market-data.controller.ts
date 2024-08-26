import {
  Asset,
  GetBarsDto,
  GetMarketCalendarDto,
  GetNewsDto,
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
  QueryAssetsDto,
  SymbolDto,
} from '@finlerk/shared';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import { infinityPagination } from '@/lib/utils/infinity-pagination';
@ApiTags('Market data')
@Controller({
  path: 'market-data',
  version: '1',
})
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: InfinityPaginationResponse(Asset),
  })
  @Get('assets')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryAssetsDto,
  ): Promise<InfinityPaginationResponseDto<Asset>> {
    const globalFilter = query.globalFilter;
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.marketDataService.findManyWithPagination({
        paginationOptions: {
          page,
          limit,
        },
        globalFilter,
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('historical-bars/:symbol')
  @HttpCode(HttpStatus.OK)
  getStockBars(@Param() params: SymbolDto, @Query() getBarsDto: GetBarsDto) {
    return this.marketDataService.getHistoricalBars({
      ...params,
      ...getBarsDto,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('most-active')
  @HttpCode(HttpStatus.OK)
  mostActive() {
    return this.marketDataService.mostActives();
  }

  @Get('most-active-stocks-snapshots')
  @HttpCode(HttpStatus.OK)
  mostActiveStocksSnapshot() {
    return this.marketDataService.mostActiveStocksSnapshots();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('market-clock')
  @HttpCode(HttpStatus.OK)
  getMarketClock() {
    return this.marketDataService.getMarketClock();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('market-calendar')
  @HttpCode(HttpStatus.OK)
  getMarketCalendar(@Query() query: GetMarketCalendarDto) {
    return this.marketDataService.getMarketCalendar(query);
  }
}
