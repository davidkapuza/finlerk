import { ConfigType } from '@/lib/config/config.type';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import ws, { WebSocket } from 'ws';
@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class MarketDataGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  ws: WebSocket;

  constructor(private readonly configService: ConfigService<ConfigType>) {
    this.ws = new ws('wss://stream.data.alpaca.markets/v2/iex');
  }
  handleConnection(client: Socket) {
    client.on('disconnecting', () => {
      const rooms = Array.from(client.rooms);

      rooms.forEach((room) => {
        if (room === client.id) return;

        const roomSize = this.server.sockets.adapter.rooms.get(room)?.size || 0;

        if (roomSize === 1) {
          this.ws.send(
            JSON.stringify({
              action: 'unsubscribe',
              bars: [room],
            }),
          );
        }
      });
    });
  }

  afterInit() {
    this.ws.on('open', () => {
      this.ws.send(
        JSON.stringify({
          action: 'auth',
          key: this.configService.getOrThrow('alpaca.token', { infer: true }),
          secret: this.configService.getOrThrow('alpaca.secret', {
            infer: true,
          }),
        }),
      );
    });
    this.ws.on('message', async (data: Buffer) => {
      const message = JSON.parse(data.toString())[0];
      if (message && message?.S) {
        this.server.to(message.S).emit('new-bar', message);
      }
    });
  }

  @SubscribeMessage('subscribe')
  async handleMessage(
    @MessageBody() data: { asset: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.ws.send(
      JSON.stringify({
        action: 'subscribe',
        bars: [data.asset],
      }),
    );
    client.join(data.asset);
  }
}
