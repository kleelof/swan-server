import { Socket } from 'socket.io';
import io from 'socket.io';

export interface ISocketView {
    processRequest: (socket:Socket, args: any, io: io.Server) => void
}




