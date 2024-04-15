import { CodeNode, IRender } from 'src/ICodeSandBox';
export declare class RenderAdapter implements IRender {
    private renderer;
    constructor();
    render(node: CodeNode, options?: any): string;
}
