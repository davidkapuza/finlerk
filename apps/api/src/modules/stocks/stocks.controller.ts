import { EventEmitterInterface } from '@modules/redis-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '@modules/redis-pub-sub/event/emitter/redis.event-emitter';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { NewMessageEvent } from './event/new-message.event';

@ApiCookieAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stocks')
@Controller({
  path: 'stocks',
  version: '1',
})
export class StocksController {
  constructor(
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly eventEmitter: EventEmitterInterface,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  async testEvent(@Body() request) {
    this.eventEmitter.emit(
      NewMessageEvent.name,
      new NewMessageEvent(request.message),
    );
  }
}
