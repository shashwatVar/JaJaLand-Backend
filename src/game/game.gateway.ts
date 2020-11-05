import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import {activeRooms} from './interfaces/activeRoom.interface';


@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private ActiveRooms = [];

  private logger: Logger = new Logger('AppGateway');
  @WebSocketServer() wss: Server;
  
  afterInit() {
    this.logger.log('Initialized!');
  }
  
   handleConnection(client : Socket) {
    const keyArray = this.ActiveRooms.map((item) => { return item["RoomId"]; });
    this.wss.emit('ActiveRooms', keyArray);
    this.logger.log(`client has connected : socketId : ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, data: {PlayerName: string, RoomId: string}) {
    this.ActiveRooms.push({host : data.PlayerName, RoomId : data.RoomId,
       players : [{ socket: client.id, name: data.PlayerName }]} as activeRooms);

    client.join(data.RoomId);
    
    this.wss.in(data.RoomId).emit('playerJoined', `${data.PlayerName} created and joined ${data.RoomId}`);
    this.wss.in(data.RoomId).emit("num_players", this.wss.sockets.adapter.rooms[data.RoomId].length);
    this.ActiveRooms.forEach(room => {
      if (room.RoomId == data.RoomId){
        this.wss.in(data.RoomId).emit('MyRoom', room);
      }
    });
    this.logger.log(this.ActiveRooms);
    const keyArray = this.ActiveRooms.map((item) => { return item["RoomId"]; });
    this.wss.emit('ActiveRooms', keyArray);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, data: {PlayerName: string, RoomId: string}) {
    
    if (this.ActiveRooms.some((room) => room.RoomId === data.RoomId)) {
      client.join(data.RoomId);
      this.wss.in(data.RoomId).emit("playerJoined", `${data.PlayerName}  joined  ${data.RoomId}`);
      this.wss.in(data.RoomId).emit(
        "num_players",
        this.wss.sockets.adapter.rooms[data.RoomId].length
      );
      this.ActiveRooms.forEach(room => {
        if (room.RoomId == data.RoomId){
          room.players.push({ socket: client.id, name: data.PlayerName });
          this.wss.in(data.RoomId).emit('MyRoom', room);
        }
      });
    } else {
      client.emit("room_error", "This room does not exist");
    }
    this.logger.log(this.ActiveRooms);
    const keyArray = this.ActiveRooms.map((item) => { return item["RoomId"]; });
    this.wss.emit('ActiveRooms', keyArray);
  }

  @SubscribeMessage('setActive')
  handlesetActive(client: Socket, data: { room : {socket: string, name: string}[], points : number[] , RoomId: string }) {
    this.wss.in(data.RoomId).emit("ActiveUser", {activeUser: data.room[data.points.length]["socket"]});
  }

  @SubscribeMessage('handleJoke')
  handleJoke(client: Socket, data: { joke : string, RoomId: string }) {
    client.to(data.RoomId).emit("sentJoke", {joke : data.joke});
  }

  @SubscribeMessage('UpdateRating')
  UpdateRating(client: Socket, data: {points : number[] , RoomId: string }) {
    if (data.points.length < 5){
      this.wss.in(data.RoomId).emit("UpdatedRating", {points : data.points});
    } else {
      // do do the changes to move to next round
    }
    
  }

  /* @SubscribeMessage('leaveRoom')
  handleRoomLeave(client: Socket, data: {PlayerName: string, RoomId: string} ) {

    const rooms = Object.keys(this.wss.nsps['/'].adapter.rooms);

    this.ActiveRooms.forEach((ele, index) => {
      let remove  = -1;
      if (rooms.includes(ele.RoomId)){
        ele.players.forEach((room: { socket: string, name: string }) => {
          if (room.socket == client.id){
            remove = index; 
          }
        });
      }
      else {
        this.ActiveRooms.splice(index, 1);
      }
      ele.players.splice(remove, 1);
    });

    client.to(data.RoomId).emit("playerLeft", `${data.PlayerName} left the game`);
    this.wss.in(data.RoomId).emit("num_players", this.wss.sockets.adapter.rooms[data.RoomId].length);
    client.leave(data.RoomId);
  } */

  //HANDLE DISCONNECT
  async handleDisconnect(client : Socket) {  
    const rooms = Object.keys(this.wss.nsps['/'].adapter.rooms);

    this.ActiveRooms.forEach((ele, index) => {
      let remove = -1;
      if (rooms.includes(ele.RoomId)){
        ele.players.forEach((room: { socket: string, name: string }) => {
          if (room.socket == client.id){
            remove = ele.players.indexOf(room);  
          }
        });
      }
      else {
        this.ActiveRooms.splice(index, 1);
      }
      if (remove >= 0){
        ele.players.splice(remove, 1);
        this.wss.in(ele.RoomId).emit('MyRoom', ele);
      } 
    });
    this.logger.log(this.ActiveRooms);
    this.logger.log(`client has disconnected`);
    const keyArray = this.ActiveRooms.map((item) => { return item["RoomId"]; });
    this.wss.emit('ActiveRooms', keyArray);
  }
}