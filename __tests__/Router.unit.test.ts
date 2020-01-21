import Router, { HTTPRoute, SocketRoute } from '../src/Router';
import { TemplateView } from '../src/views';
import { Request } from '../src/Request'

describe(' Router testing ', () => {
    describe( 'HTTPRoute tests ', () => {
        let testView: TemplateView = new TemplateView('test.html');
        let httpRoute: HTTPRoute = new HTTPRoute('/b', 'testRoute', testView);

        it(' should initialize properly ', () => {
            expect(httpRoute.path).toEqual('b/');
            expect(httpRoute.name).toEqual('testRoute');
            expect(httpRoute.view).toBe(testView);
        })

        describe(' test checkRoute ', () => {
            beforeAll(() => {
                httpRoute = new HTTPRoute('/b/<n:nmbr>/<s:strg>', 'testRoute', testView);
            })

            it(' should accept proper incoming path ', () => {
                expect(httpRoute.checkRoute('/b/1/hello')).toEqual({nmbr: 1, strg: 'hello'}); 
            })

            it( 'should reject if path before parameters is incorrect ', () => {
                expect(httpRoute.checkRoute('/c/1/hello')).toEqual(null);
            })
    
            it('should reject if "n" param is not number', () => {
                expect(httpRoute.checkRoute('/b/shouldBeNumber/hello')).toEqual(null);
            })

            it('should reject if "s" param is not string', () => {
                expect(httpRoute.checkRoute('/b/1/5')).toEqual(null);
            })

            it(' should reject if mismatch number of parameters', () => {
                expect(httpRoute.checkRoute('/b/x/1/hello')).toEqual(null);
            })
        })

        
    })
});

