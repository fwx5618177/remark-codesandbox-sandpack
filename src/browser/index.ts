import { visit } from 'unist-util-visit';

import { Utils } from './utils';
import { CodeNode, Options } from './IBrowser';

const remarkSandpack = (options: Options) => {
    return (tree: CodeNode) => {
        visit(tree, 'code', (node: CodeNode) => {
            const meta = Utils.parseCodeBlock(node.meta);

            console.log(meta);

            const sandboxMeta = meta?.codesandbox;

            if (!sandboxMeta) return;

            // 执行策略实现代码的处理
            Utils.processNodeForDisplay(node, sandboxMeta, options);
        });
    };
};

export default remarkSandpack;
