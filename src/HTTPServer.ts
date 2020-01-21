import * as Session from 'client-sessions';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Request, resourceTypes } from './Request';
import { Response } from './Response';
import Router, { HTTPRoute } from './Router';
import { IServerOptions } from './Swan';

export interface IHTTPServer{
    beginListening: () => void
}

export class HTTPServer{
    private requestSessionHandler: any;

    constructor(private serverOptions: IServerOptions){
        this.requestSessionHandler = Session.default(serverOptions.sessionOptions)
    }

    public beginListening = (): void => {
        http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
            this.requestSessionHandler(request, response, () => {
                this.onHTTPRequestReceived(new Request(request), new Response(response));
            })
            
        })
        .listen(this.serverOptions.PORT, () => console.info(`HTTPServer Listening: ${this.serverOptions.PORT}`))
    }

    private onHTTPRequestReceived = (request: Request, response: Response): void => {
        if (request.requestResourceType === resourceTypes.static){
            const filePath = path.resolve(`static/${request.url}`);
            let statusCode = 200;
            let content: any = null;

            try{
                content = fs.readFileSync(filePath);
                console.log('loaded');
            }catch(err){
                console.log(`Template ${filePath} not found`);
                statusCode = 404
            }

            response.send(
                statusCode, 
                {
                    css: `{Content-Type: 'text/css'}`,
                    png: `{Content-Type: 'image/png'}`,
                    jpg: `{Content-Type: 'image/jpeg'}`,
                    jpeg: `{Content-Type: 'image/jpeg'}`,
                    gif: `{Content-Type: 'image/gif'}`,
                    bmp: `{Content-Type: 'image/bmp'}`,
                    js: `application/javascript`
                }[request.extension], 
                content
                );
        }else{
            const route: HTTPRoute | null = Router.getRouteByPath(request.url);
        
            if (route){
                route.view.render(request, response)
            }else{
                response.send(404, `{Content-Type: 'html/text'}`);
            }
        } 
    }
}