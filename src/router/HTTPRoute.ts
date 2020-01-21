import { TemplateView } from '../views/TemplateView';
import { Route } from './Route';

export class HTTPRoute implements Route{
    public path: string = '';
    public pathParts: string[] = [];

    constructor(path:string, public name: string, public view: TemplateView){
        this.pathParts = path.replace(/^\/|\/$/g, '').split('/');
        this.path = `${this.pathParts[0]}/`;
    }

    public checkRoute = (path: string): {} | null  => {
        const pathParts: any[] = path.replace(/^\/|\/$/g, '').split('/');
        if (this.pathParts.length !== pathParts.length) {return null};
        const params: {} = {};
        let match: RegExpMatchArray | null;
        let bits: string[];

        for(let i = 0; i < this.pathParts.length; i++){
            match = this.pathParts[i].match(/\<([^)]+)\>/);
            if(match){
                bits = match[1].split(':');
                switch(bits[0]){
                    case 'n':
                        if (!isNaN(pathParts[i])){
                            params[bits[1]] = Number(pathParts[i]);
                        }else{
                            return null
                        }
                        break;
                    case 's': 
                        if(isNaN(pathParts[i])){
                            params[bits[1]] = String(pathParts[i]); 
                        } else {
                            return null
                        }
                        break;
                }   
            }else{
                if (this.pathParts[i] !== pathParts[i]) {return null};
            }
        }
        return params;
    }
}