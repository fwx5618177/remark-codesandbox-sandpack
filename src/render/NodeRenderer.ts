import React from 'react';
import { CodeNode, IRender, RenderOptions } from 'src/ICodeSandBox';
import ReactDOMServer from 'react-dom/server';

import SandpackTemplate from './SandpackTemplate';

export class NodeRenderer implements IRender {
    render(node: CodeNode, options?: RenderOptions): string {
        console.log('BrowserRenderer: ', node.type, options);
        const sandpackComponent = React.createElement(SandpackTemplate, {
            template: options?.template,
            files: node.value,
        } as any);

        return ReactDOMServer.renderToString(sandpackComponent);
    }
}
