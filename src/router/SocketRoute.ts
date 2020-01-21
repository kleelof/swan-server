import { SocketView } from '../views/SocketView';


export class SocketRoute {
    constructor(public name: string, public view: SocketView){}

    public checkRoute = (name: string): {} | null => {
        if (this.name === name){
            return {};
        }else{
            return null;
        }
    }
}

