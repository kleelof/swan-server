import { ISocketView } from '../views/SocketView';


export class SocketRoute {
    constructor(public name: string, public view: ISocketView){}

    public checkRoute = (name: string): {} | null => {
        if (this.name === name){
            return {};
        }else{
            return null;
        }
    }
}

