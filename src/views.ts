import { Request } from './Request';
import { Response } from './Response';
import path = require('path');
import fs from 'fs';
import { Socket } from 'socket.io';

export interface IView{
}

export abstract class View {
    public render = (request: Request, response: Response) => {}
}

export interface ITemplateView {
    template: string;
}

export class TemplateView extends View implements ITemplateView {
    public template:string = '';

    constructor(template?: string){
        super();
        if (template) this.template = template;
    }

    public render = (request: Request, response: Response): void => {
        response.render(200, this.getTemplate());
    }

    protected getTemplate = (templatePath?: string): string | undefined => {
        templatePath = path.resolve(`templates/${(templatePath)? templatePath:this.template}`);
        let template: string | undefined = undefined;
        
        try{
            template = fs.readFileSync(templatePath).toString();
        }catch(err){
            console.log(`Template ${templatePath} not found`);
        }

        return template;
    }
}

export abstract class SocketView extends View {
    public abstract processRequest = (socket: Socket, args: any, fn: () => {}): void =>{}

    protected respond = (socket: Socket, data: {}):void => {
        socket.send(data);
    }
}




