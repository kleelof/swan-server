import http, {IncomingMessage} from 'http';
import { Socket} from "net";

export enum resourceTypes {
    static,
    template
}

export class Request {

    public static createTestRequest(HTTPrequestParameters?: {}){
        const httpRequest: http.IncomingMessage = new http.IncomingMessage(new Socket());
        Object.assign(httpRequest, HTTPrequestParameters)
        return new Request(httpRequest);
    }

    public parameters = {};
    public pathParameters = {};
    public extension: string = ``;
    public url: string = ``;
    public method: string | undefined;
    public requestResourceType: resourceTypes | undefined = resourceTypes.template;
    public routeDomain: string | undefined;
    public httpRequest: http.IncomingMessage | undefined;
    
    private staticFileExtensions = [`css`, `png`, 'js'];

    constructor(public request:http.IncomingMessage){
        console.log(request.url);
        this.httpRequest = request;
        if (request){
            this.method = request.method;

            if (request.url){
                this.url = request.url;

                if (request.url.indexOf(`?`) > -1){
                    const queryString = request.url.split('?')[1];
                    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
                    for (const pair of pairs){
                        const bits = pair.split('=');
                        this.parameters[decodeURIComponent(bits[0])] = decodeURIComponent(bits[1] || '');
                    }
                }
                const urlParts = /(?:\.([^.]+))?$/.exec(request.url);
                if (urlParts && urlParts[1]) {this.extension = urlParts[1]};

                if (this.staticFileExtensions.indexOf(this.extension) > -1) {this.requestResourceType = resourceTypes.static;} 
            }
        }
    }
}