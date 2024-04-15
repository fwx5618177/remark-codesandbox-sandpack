import { CodeNode, IRender, RenderOptions } from 'src/ICodeSandBox';
export declare class NodeRenderer implements IRender {
    render(node: CodeNode, options?: RenderOptions): string;
}
