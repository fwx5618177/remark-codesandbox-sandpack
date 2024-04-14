import { CodeNode, IRender } from 'src/ICodeSandBox';

import { BrowserRenderer } from './BrowserRenderer';
import { NodeRenderer } from './NodeRenderer';

export class RenderAdapter implements IRender {
    private renderer: IRender;

    constructor() {
        if (typeof window !== 'undefined') {
            this.renderer = new BrowserRenderer();
        } else {
            this.renderer = new NodeRenderer();
        }
    }

    render(node: CodeNode, options?: any): string {
        return this.renderer.render(node, options);
    }
}
