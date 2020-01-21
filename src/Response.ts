import http from 'http';
import { IRenderer, Renderer } from './Renderer';
import { HTTPRoute } from './router/HTTPRoute';
import { Route } from './router/Route';
import Router from './router/Router';

export class Response {
    private renderer: IRenderer;

    constructor(public httpResponse: http.ServerResponse){
        this.renderer = new Renderer();
    }

    public render(statusCode: number, template?: string | undefined, fill?: {}){
        if (template) {template = this.renderer.render(template, (fill)? fill: {})};
        this.send(statusCode, `{Content-Type: 'html/text'}`, template);
    }

    public redirect(routeName: string){
        const route: Route | null = Router.getRouteByName(routeName);
        if (route){
            this.httpResponse.writeHead(303, {Location: (route as HTTPRoute).path});
            this.httpResponse.end();
        }else{
            console.error(`Invalid route name: ${routeName}`);
        }
        
    }

    public respondJSON = (data: {}): void => {
        this.send(200, 'application/json', JSON.stringify(data));
    }

    public send(statusCode: number, contentType: string, content?: string | null){
        this.httpResponse.writeHead(statusCode, {
            'Content-Type' : contentType
        })
        this.httpResponse.end(content);
    }
}