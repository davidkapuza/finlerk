import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StocksService } from './stocks.service';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stocks')
@Controller({
  path: 'stocks',
  version: '1',
})
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('news')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbols',
    type: 'string',
    example: 'TSLA,AAPL',
  })
  getNews(
    @Query('symbols', new ParseArrayPipe({ items: String, separator: ',' }))
    symbols: string[],
  ) {
    return this.stocksService.getNews(symbols);
  }

  @Get('historical-bars')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'symbol',
    isArray: false,
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
  })
  getLatestTrades(
    @Query('symbols', new ParseArrayPipe({ items: String, separator: ',' }))
    symbols: string[],
  ) {
    return this.stocksService.getLatestTrades(symbols);
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
}
