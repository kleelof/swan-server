import * as Session from 'client-sessions';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Request, resourceTypes } from './Request';
import { Response } from './Response';
import { HTTPRoute } from './router/HTTPRoute';

export interface IHTTPServer{
    beginListening: () => void
}

export interface IHTTPServerOptions {
    sessionOptions: Session.SessionOptions,
    PORT: number,
    routes: HTTPRoute[]
}

export class HTTPServer{
    private requestSessionHandler: any;
    private routes: HTTPRoute[];

    constructor(private serverOptions: IHTTPServerOptions){
        this.requestSessionHandler = Session.default(serverOptions.sessionOptions)
        this.routes = serverOptions.routes;
    }

    public listen = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
                this.requestSessionHandler(request, response, () => {
                    this.onHTTPRequestReceived(new Request(request), new Response(response));
                })
                
            })
            .listen(this.serverOptions.PORT, () => console.info(`HTTPServer Listening: ${this.serverOptions.PORT}`))
            .on('error', (err) => {
                reject(err);
            })
            .on('listening', () => resolve)
        })
    }

    private onHTTPRequestReceived = (request: Request, response: Response): void => {
        if (request.requestResourceType === resourceTypes.static){
            const filePath = path.resolve(`static/${request.url}`);
            let statusCode = 200;
            let content: any = null;

            try{
                content = fs.readFileSync(filePath);
            }catch(err){
                console.log(`Template ${filePath} not found`);
                statusCode = 404
            }

            response.send(
                statusCode, 
                {
                    bmp: 'image/bmp',
                    css: 'text/css',
                    gif: 'image/gif',
                    jpeg: 'image/jpeg',
                    jpg: 'image/jpeg',
                    js: `application/javascript`,
                    png: 'image/png'
                }[request.extension], 
                content
                );
        }else{
            const route: HTTPRoute | null = this.getRouteByPath(request.url);
        
            if (route){
                route.view.render(request, response)
            }else{
                response.send(404, `{Content-Type: 'html/text'}`);
            }
        } 
    }

    private getRouteByPath(url: string): HTTPRoute | null {
        const routes: HTTPRoute[] = this.routes.filter( route => route.checkRoute(url) );
        return (routes[0])? routes[0] : null;
    }
}