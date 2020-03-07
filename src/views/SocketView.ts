import { Socket, EngineSocket } from 'socket.io';
import io from 'socket.io';

export interface ISocketView {
    processRequest: (socket:Socket, args: any, fn: (data: {}) => {}, io: io.Server) => void
}

export class SocketView  {
    public processRequest = (socket:Socket, data: any, fn: (data: {}) => {}, io: io.Server) => {
        fn(data);
    }

    protected respond = (socket: Socket, data: {}):void => {
        socket.send(data);
    }
}




