import { CodeNode, IRender, RenderOptions } from 'src/ICodeSandBox';
export declare class BrowserRenderer implements IRender {
    render(node: CodeNode, options?: RenderOptions): string;
}
