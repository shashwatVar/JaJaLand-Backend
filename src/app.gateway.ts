import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/game' })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('AppGateway');
  @WebSocketServer() wss: Server;

  handleDisconnect() {
    this.logger.log(`client has disconnected`);
  }

  handleConnection(client : Socket) {
    this.logger.log(`client has connected ${Object.keys(client.rooms)}`);
  }

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, room: string) {
    client.join(room);
    client.to(room).emit('roomCreated', {room: room});
    this.logger.log(room);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string ) {
    client.join(room);
    this.logger.log(`client has joined the room: ${room}`);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, room: string ) {
    client.leave(room);
    this.logger.log(`client has left the room: ${room}`);
    client.emit('leftRoom', room);
  }
}