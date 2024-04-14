import { CodeNode, IRender, RenderOptions } from 'src/ICodeSandBox';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

import SandpackTemplate from './SandpackTemplate';

export class BrowserRenderer implements IRender {
    render(node: CodeNode, options?: RenderOptions): string {
        console.log('BrowserRenderer: ', node.type, options);
        const sandpackComponent = React.createElement(SandpackTemplate, {
            ...(options as any),
        });

        return ReactDOMServer.renderToString(sandpackComponent);
    }
}
