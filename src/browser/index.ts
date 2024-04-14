import { visit } from 'unist-util-visit';

import { CodeNode, Options } from '../ICodeSandBox';

import { Utils } from './utils';

const remarkSandpack = (options: Options) => {
    return (tree: CodeNode) => {
        visit(tree, 'code', (node: CodeNode) => {
            const meta = Utils.parseCodeBlock(node.meta);
            const sandboxMeta = meta?.codesandbox;
            if (!sandboxMeta) return;

            // 执行策略实现代码的处理
            Utils.processNodeForDisplay(node, sandboxMeta, options);
        });
    };
};

export default remarkSandpack;
