
import { Request, resourceTypes } from '../src/Request';

describe( ' Request Tests ', () => {
    let testConfig: {};
    let request: Request;

    beforeEach(() => {
        testConfig = {
            method: 'test_method',
            url: '/testSlugPath'
        }
        request = Request.createTestRequest(testConfig);
    })

    it( ' should initialize properly ', () => {
        expect(request.method).toEqual('test_method');
        expect(request.url).toEqual('/testSlugPath');
        expect(request.requestResourceType).toEqual(resourceTypes.template)
    })

    it(' should extract URL parameters ', () => {
        request = Request.createTestRequest({url: "testSlug/?a=1&b=2&c='testString'"});
        expect(request.parameters['a']).toEqual('1');
        expect(request.parameters['b']).toEqual('2');
    })

    describe(' extension tests ', () => {
        it(' should detect and isolate extension', () => {
            request = Request.createTestRequest({url: 'has.ext'});
            expect(request.extension).toEqual('ext');
            expect(request.requestResourceType).toEqual(resourceTypes.template);
        })

        it(' should identify valid static extensions ', () => {
            request = Request.createTestRequest({url: 'valid.css'});
            expect(request.requestResourceType).toEqual(resourceTypes.static);
        })
    });
})