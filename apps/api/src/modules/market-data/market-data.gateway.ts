import { ConfigType } from '@/lib/config/config.type';
import { SubscribeToBarsDto } from '@finlerk/shared';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import ws from 'ws';

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class WebsocketsGateway {
  constructor(private readonly configService: ConfigService<ConfigType>) {}

  @SubscribeMessage('bars')
  async streamMessagesData(
    @ConnectedSocket() client: Socket,
    @MessageBody() subscribeToBarsDto: SubscribeToBarsDto,
  ) {
    const socket = new ws('wss://stream.data.alpaca.markets/v2/iex');

    socket.on('open', () => {
      socket.send(
        JSON.stringify({
          action: 'auth',
          key: this.configService.getOrThrow('alpaca.token', { infer: true }),
          secret: this.configService.getOrThrow('alpaca.secret', {
            infer: true,
          }),
        }),
      );
    });

    socket.on('message', (data: Buffer) => {
      const message = JSON.parse(data.toString())[0];

      if (message && message?.msg === 'authenticated') {
        socket.send(
          JSON.stringify({
            action: 'subscribe',
            bars: subscribeToBarsDto.bars,
          }),
        );
      } else if (message && message?.S) {
        client.emit('new-bar', message);
      }
    });

    client.on('disconnect', () => {
      socket.close();
    });
  }
}
