import SocketServer from '../SocketServer';
import { HTTPRoute } from './HTTPRoute';
import { Route } from './Route';
import { SocketRoute } from './SocketRoute';


export class Router{
    public routes: HTTPRoute[] = [];

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
        const routes: HTTPRoute[] = this.routes.filter( route => route.checkRoute(path) );
        return (routes[0])? routes[0] : null;
    }

    public getRouteByName(name: string): Route | null {
        const routes: Route[] = this.routes.filter((route) => (route.name === name) );
        return (routes.length)? routes[0] : null;
    }
}

export default new Router();