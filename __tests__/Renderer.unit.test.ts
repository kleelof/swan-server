import { Renderer } from '../src/Renderer';

describe(' Renderer Tests ', () => {
    const renderer: Renderer = new Renderer();

    it(' should render properly ', () => {
       const renderedText: string = renderer.render(
           '{{var_1}}{{var_2}}',
           {
               var_1: 'testInsert1',
               var_2: 'testInsert2'
           }
           );
        
        expect(renderedText).toContain('testInsert1');
        expect(renderedText).toContain('testInsert2');
    })
})