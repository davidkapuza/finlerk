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
import { GetAssetsDto } from './dtos/get-assets.dto';

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
  getAssets(@Query() getAssetsDto: GetAssetsDto) {
    return this.marketDataService.getAssets(getAssetsDto);
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
