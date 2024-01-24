import { AlpacaNews } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
    isArray: true,
    required: true,
  })
  getNews(@Query('symbols') symbols: string): Promise<AlpacaNews[]> {
    return this.stocksService.getNews(symbols.split(','));
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
    isArray: true,
    required: true,
  })
  getLatestTrades(@Query('symbols') symbols: string) {
    return this.stocksService.getLatestTrades(symbols.split(','));
  }
}
