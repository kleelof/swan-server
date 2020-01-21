import * as Session from 'client-sessions';
import { HTTPServer, IHTTPServer } from './HTTPServer';
import { Route } from './router/Route';
import Router from './router/Router';
import SocketServer, { ISocketOptions } from './SocketServer';

export interface IServerOptions {
    sessionOptions: Session.SessionOptions,
    PORT: number
}

export class Swan{

    public static buildTestSwan(routes: Route[], serverOptions: IServerOptions){
        return new Swan(routes, serverOptions);
    }

    private HTTPServer: IHTTPServer | undefined;

    constructor(routes: Route[], private serverOptions?: IServerOptions, private socketOptions?: ISocketOptions){
        Router.addRoutes(routes);
        if (serverOptions){
            this.HTTPServer = new HTTPServer(serverOptions)
        }
        if (socketOptions) {this.socketOptions = socketOptions};
    }

    public start = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if(this.HTTPServer) {this.HTTPServer.beginListening()};
            if(this.socketOptions) {
                SocketServer.listen(this.socketOptions.PORT)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
            }
        })  
    }
}