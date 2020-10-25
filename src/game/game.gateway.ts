import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

interface activeRooms {
  host: string;
  RoomId: string;
}

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private ActiveRooms = [];

  private logger: Logger = new Logger('AppGateway');
  // this wss is equivalent to io
  @WebSocketServer() wss: Server;

   async handleDisconnect() {
    const rooms = Object.keys(this.wss.nsps['/'].adapter.rooms);

    this.ActiveRooms.forEach((ele, index) => {
      if (rooms.includes(ele.RoomId)){
        this.logger.log(ele.RoomId);
      }
      else {
        this.ActiveRooms.splice(index, 1);
      }
    });

    this.logger.log(this.ActiveRooms);
    this.logger.log(`client has disconnected`);
  }

  handleConnection(client : Socket) {
    this.logger.log(`client has connected : socketId : ${client.id}`);
  }

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, data: {PlayerName: string, RoomId: string}) {
    this.ActiveRooms.push({host : data.PlayerName, RoomId : data.RoomId} as activeRooms);
    client.join(data.RoomId);
    this.logger.log(`${data.PlayerName} created and joined ${data.RoomId}`);
    this.wss.in(data.RoomId).emit('playerJoined', `${data.PlayerName} created and joined ${data.RoomId}`);
    this.wss.in(data.RoomId).emit("num_players", this.wss.sockets.adapter.rooms[data.RoomId].length);
    this.wss.clients((error: Error, clients: string[]) => {
      if (error) throw error;
      this.logger.log(clients);
    });
    this.logger.log(this.ActiveRooms);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, data: {PlayerName: string, RoomId: string}) {
    if (this.ActiveRooms.some((room) => room.RoomId === data.RoomId)) {
      client.join(data.RoomId);
      this.logger.log(`${data.PlayerName}  joined  ${data.RoomId}`);
      this.wss.in(data.RoomId).emit("playerJoined", `${data.PlayerName}  joined  ${data.RoomId}`);
      this.wss.in(data.RoomId).emit(
        "num_players",
        this.wss.sockets.adapter.rooms[data.RoomId].length
      );
      this.logger.log(this.wss.sockets.adapter.rooms[data.RoomId]);
    } else {
      client.emit("room_error", "This room does not exist");
    }
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, data: {PlayerName: string, RoomId: string} ) {

    const rooms = Object.keys(this.wss.nsps['/'].adapter.rooms);

    this.ActiveRooms.forEach((ele, index) => {
      if (rooms.includes(ele.RoomId)){
        this.logger.log(ele.RoomId);
      }
      else {
        this.ActiveRooms.splice(index, 1);
      }
    });

    client.to(data.RoomId).emit("playerLeft", `${data.PlayerName} left the game`);
    this.wss.in(data.RoomId).emit("num_players", this.wss.sockets.adapter.rooms[data.RoomId].length);
    client.leave(data.RoomId);
  }
}