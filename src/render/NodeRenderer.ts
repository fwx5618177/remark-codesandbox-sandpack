import React from 'react';
import { CodeNode, IRender, RenderOptions } from 'src/ICodeSandBox';
import ReactDOMServer from 'react-dom/server';

import SandpackTemplate from './SandpackTemplate';

export class NodeRenderer implements IRender {
    render(node: CodeNode, options?: RenderOptions): string {
        // console.log('NodeRenderer: ', node, options);
        const sandpackComponent = React.createElement(SandpackTemplate, {
            template: node.lang,
            files: {
                '/App.js': node.value,
            },
            theme: options?.theme,
        } as any);

        return ReactDOMServer.renderToString(sandpackComponent);
    }
}
