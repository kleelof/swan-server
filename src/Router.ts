import { TemplateView } from './views';
import SocketServer from './SocketServer';
import { SocketView } from '.';

export class Router{
    public routes: HTTPRoute[] = [];

    constructor() {}

    public addRoutes = (routes: Route[]) => {
        routes.forEach((route: Route) => { 

            if(route instanceof HTTPRoute){
                this.routes.push(route);
            }else{
                SocketServer.addRoute(route as SocketRoute);
            }
        })
    }

    public getRouteByPath(path: string): HTTPRoute | null {
        const _routes: HTTPRoute[] = this.routes.filter( route => route.checkRoute(path) );
        return (_routes[0])? _routes[0] : null;
    }

    public getRouteByName(name: string): Route | null {
        const routes: Route[] = this.routes.filter((route) => {  return (route.name == name); });
        return (routes.length)? routes[0] : null;
    }
}

export abstract class Route{
    public abstract checkRoute = (path: string): {} | null => { return null; }
}

export class HTTPRoute implements Route{
    public path: string = '';
    public pathParts: string[] = [];

    constructor(_path:string, public name: string, public view: TemplateView){
        this.pathParts = _path.replace(/^\/|\/$/g, '').split('/');
        this.path = `${this.pathParts[0]}/`;
    }

    public checkRoute = (path: string): {} | null  => {
        let _pathParts: any[] = path.replace(/^\/|\/$/g, '').split('/');
        if (this.pathParts.length !== _pathParts.length) return null;
        let params: {} = {};
        let match: RegExpMatchArray | null;
        let bits: string[];

        for(let i = 0; i < this.pathParts.length; i++){
            match = this.pathParts[i].match(/\<([^)]+)\>/);
            if(match){
                bits = match[1].split(':');
                switch(bits[0]){
                    case 'n':
                        if (!isNaN(_pathParts[i])){
                            params[bits[1]] = Number(_pathParts[i]);
                        }else{
                            return null
                        }
                        break;
                    case 's': 
                        if(isNaN(_pathParts[i])){
                            params[bits[1]] = String(_pathParts[i]); 
                        } else {
                            return null
                        }
                        break;
                }   
            }else{
                if (this.pathParts[i] !== _pathParts[i]) return null;
            }
        }
        return params;
    }
}

export class SocketRoute implements Route{
    constructor(public name: string, public view: SocketView){}

    public checkRoute = (_name: string): {} | null => {
        if (this.name === _name){
            return {};
        }else{
            return null;
        }
    }
}
export default new Router();