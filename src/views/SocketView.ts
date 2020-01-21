import { Socket } from 'socket.io';

export interface ISocketView {
    processRequest: (socket:Socket, args: any, fn: (data: {}) => {}) => void
}

export class SocketView  {
    public processRequest = (socket:Socket, data: any, fn: (data: {}) => {}) => {
        fn(data);
    }

    protected respond = (socket: Socket, data: {}):void => {
        socket.send(data);
    }
}




