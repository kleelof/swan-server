import { createServer, Server } from 'http';
import io from 'socket.io'
import { SocketRoute } from './Router';

export interface ISocketOptions {
    PORT: number
}

export class SocketServer {
    private httpConnection: Server;
    private socketHandler: any;
    private routes: SocketRoute[] = [];

    constructor(){
        this.httpConnection = createServer();
        this.socketHandler = io(this.httpConnection);
    }

    public listen(PORT: number): Promise<String> {
        return new Promise((resolve, reject) => {
            this.socketHandler.on('connection', (socket: io.Socket) => {
                
                this.routes.forEach((route: SocketRoute) => {
                    socket.on(route.name, (args: any, fn) => {
                        route.view.processRequest(socket, args, fn);
                    })
                })
            })

            this.httpConnection.on('error', (err) => {
                reject(`SocketServer Error: ${err}`)
            })
    
            this.httpConnection.listen(PORT, () => {
                console.log(`SocketServer Listening: ${PORT}`)
                resolve();
            })
        })
    }

    public addRoute(route: SocketRoute): void  {
        this.routes.push(route);
    }
}

export default new SocketServer();