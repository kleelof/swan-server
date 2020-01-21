import fs from 'fs';
import path from 'path';
import { Request } from '../Request';
import { Response } from '../Response';

export interface ITemplateView {
    template: string;
}

export class TemplateView implements ITemplateView {
    public template:string = '';

    constructor(template?: string){
        if (template) {this.template = template};
    }

    public render = (request: Request, response: Response): void => {
        response.render(200, this.getTemplate());
    }

    protected getTemplate = (templatePath?: string): string | undefined => {
        templatePath = path.resolve(`templates/${(templatePath)? templatePath:this.template}`);
        let template: string | undefined;
        
        try{
            template = fs.readFileSync(templatePath).toString();
        }catch(err){
            console.log(`Template ${templatePath} not found`);
        }

        return template;
    }
}