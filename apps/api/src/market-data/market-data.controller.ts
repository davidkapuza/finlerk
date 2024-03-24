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
import { GetBarsDto } from './dtos/get-bars.dto';
import { GetNewsDto } from './dtos/get-news.dto';
import { MarketDataService } from './market-data.service';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('MarketData')
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
