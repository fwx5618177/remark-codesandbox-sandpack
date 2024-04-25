import { visit } from 'unist-util-visit';
import { Options } from 'remark-parse';
import { CodeNode } from 'remark-codesandbox-sandpack';

import { parseCodeBlock, processNodeForDisplay } from './utils';

const remarkSandpack = (options: Options) => {
    return (tree: CodeNode) => {
        visit(tree, 'code', (node: CodeNode) => {
            const meta = parseCodeBlock(node);
            const sandboxMeta = meta?.codesandbox;
            if (!sandboxMeta) return;

            processNodeForDisplay(node, sandboxMeta, options);
        });
    };
};

export default remarkSandpack;
