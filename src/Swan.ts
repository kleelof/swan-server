import * as Session from 'client-sessions';
import { HTTPServer, IHTTPServerOptions } from './HTTPServer';
import { Route } from './router/Route';
import SocketServer, { ISocketOptions } from './SocketServer';



export class Swan{

    public static buildTestSwan(routes: Route[]){
        return new Swan();
    }

    public startHTTPServer = (serverOptions: IHTTPServerOptions): Promise<string> => {
        const httpServer: HTTPServer = new HTTPServer(serverOptions);
        return new Promise((resolve, reject) => {
            httpServer.listen()
                .then( () => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    public startSocketServer = (serverOptions: ISocketOptions) => {
        const socketServer: SocketServer = new SocketServer(serverOptions);
        return new Promise((resolve, reject) => {
            socketServer.listen()
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}