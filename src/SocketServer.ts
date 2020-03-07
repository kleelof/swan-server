import { createServer, Server } from 'http';
import io from 'socket.io'
import { SocketRoute } from './router/SocketRoute';

export interface ISocketOptions {
    PORT: number,
    routes: SocketRoute[],
    origins?: string
}

export default class SocketServer {
    private httpConnection: Server;
    private socketHandler: io.Server;
    private routes: SocketRoute[];
    private PORT: number;

    constructor(options: ISocketOptions){
        this.PORT = options.PORT;
        this.httpConnection = createServer();
        this.routes = options.routes;

        const socketConfig: any = {};
        if (options.origins) {socketConfig.origins = options.origins;}
        this.socketHandler = io(this.httpConnection, socketConfig);
        
    }

    public listen(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.socketHandler.on('connection', (socket: io.Socket) => {
                console.log('connection');
                this.routes.forEach((route: SocketRoute) => {
                    socket.on(route.name, (args: any) => {
                        route.view.processRequest(socket, args, this.socketHandler);
                    })
                })
            })
            
            this.httpConnection.on('error', (err) => {
                reject(`SocketServer Error: ${err}`)
            })
    
            this.httpConnection.listen(this.PORT, () => {
                console.log(`SocketServer Listening: ${this.PORT}`)
                resolve();
            })
        })
    }
}