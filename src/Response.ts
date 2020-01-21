import http from 'http';
import { IRenderer, Renderer } from './Renderer';
import Router, { Route, HTTPRoute } from './Router';
import { View } from './views';

export class Response {
    private renderer: IRenderer;

    constructor(public _response: http.ServerResponse){
        this.renderer = new Renderer();
    }

    public render(statusCode: number, template?: string | undefined, fill?: {}){
        if (template) template = this.renderer.render(template, (fill)? fill: {});
        this.send(statusCode, `{Content-Type: 'html/text'}`, template);
    }

    public redirect(routeName: string){
        const route: Route | null = Router.getRouteByName(routeName);
        if (route){
            this._response.writeHead(303, {Location: (route as HTTPRoute).path});
            this._response.end();
        }else{
            console.error(`Invalid route name: ${routeName}`);
        }
        
    }

    public respondJSON = (data: {}): void => {
        this.send(200, 'application/json', JSON.stringify(data));
    }

    public send(statusCode: number, contentType: string, content: string | undefined | null = undefined){
        this._response.writeHead(statusCode, {
            'Content-Type' : contentType
        })
        this._response.end(content);
    }
}