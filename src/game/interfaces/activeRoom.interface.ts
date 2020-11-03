export interface activeRooms {
    host: string;
    RoomId: string;
    players : { socket: string, name: string }[];
}