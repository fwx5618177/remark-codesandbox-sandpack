import { CodeNode, Options, ParsedProps } from '../IBrowser';

import { NodeCodeNodeProcessor } from './NodeCodeNodeProcessor';
import { CodeSandboxProcessor } from './CodeSandboxProcessor';
import { RawProcessor } from './RawProcessor';
import { SandpackProcessor } from './SandpackProcessor';

export class CodeNodeProcessorFactory {
    public getBrowserProcessor(
        node: CodeNode,
        sandboxMeta: ParsedProps['codesandbox'],
        options: Options,
    ): CodeSandboxProcessor | RawProcessor | SandpackProcessor {
        switch (options.type || 'sandpack') {
            case 'codesandbox':
                return new CodeSandboxProcessor(node, sandboxMeta, options);
            case 'raw':
                return new RawProcessor(node, sandboxMeta, options);
            case 'sandpack':
            default:
                return new SandpackProcessor(node, sandboxMeta, options);
        }
    }

    static getProcessor(
        node: CodeNode,
        sandboxMeta: ParsedProps['codesandbox'],
        options: Options,
    ): NodeCodeNodeProcessor | CodeSandboxProcessor | RawProcessor | SandpackProcessor {
        const { runtime } = options;
        switch (runtime || 'browser') {
            case 'node':
                return new NodeCodeNodeProcessor(node, sandboxMeta, options);
            case 'browser':
                return this.getProcessor(node, sandboxMeta, options);
            default:
                throw new Error('Unsupported runtime');
        }
    }
}
