import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stocks')
@Controller({
  path: 'stocks',
  version: '1',
})
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3000)
  @Get('news')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbols',
    type: 'string',
    required: false,
    example: 'TSLA,AAPL',
  })
  getNews(
    @Query(
      'symbols',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    symbols: string[] = [],
  ) {
    return this.stocksService.getNews(symbols);
  }

  @Get('historical-bars')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbol',
    required: true,
  })
  getHistoricalBars(@Query('symbol') symbol: string) {
    return this.stocksService.getHistoricalBars(symbol);
  }

  @Get('latest-trades')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbols',
    type: 'string',
    example: 'TSLA,AAPL',
    required: false,
  })
  getLatestTrades(
    @Query(
      'symbols',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    symbols: string[] = [],
  ) {
    return this.stocksService.getLatestTrades(symbols);
  }

  @Get('latest-bars')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbols',
    type: 'string',
    example: 'TSLA,AAPL',
  })
  getLatestBars(
    @Query('symbols', new ParseArrayPipe({ items: String, separator: ',' }))
    symbols: string[],
  ) {
    return this.stocksService.getLatestBars(symbols);
  }

  @Get('latest-quotes')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbols',
    type: 'string',
    example: 'TSLA,AAPL',
  })
  getLatestQuotes(
    @Query('symbols', new ParseArrayPipe({ items: String, separator: ',' }))
    symbols: string[],
  ) {
    return this.stocksService.getLatestQuotes(symbols);
  }

  @Get('trades')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbol',
    type: 'string',
    example: 'TSLA',
  })
  getTrades(
    @Query('symbol')
    symbol: string,
  ) {
    return this.stocksService.getTrades(symbol);
  }

  @Get('most-active')
  @HttpCode(HttpStatus.OK)
  mostActive() {
    return this.stocksService.mostActive();
  }
}
