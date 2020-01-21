import fs from 'fs';
import handlebars from 'handlebars';

export interface IRenderer{
    render: (templatePath: string, fill: {}) => string;
}

export class Renderer implements IRenderer{

    public render = (rawTemplate: string, fill: any): string => {
        const compiledTemplate: any = handlebars.compile(rawTemplate);
        return compiledTemplate(fill);
    }
}
