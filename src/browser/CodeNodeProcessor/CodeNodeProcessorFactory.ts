import { CodeNode, Options, ParsedProps } from '../../ICodeSandBox';

import { NodeCodeNodeProcessor } from './NodeCodeNodeProcessor';
import { CodeSandboxProcessor } from './CodeSandboxProcessor';
import { RawProcessor } from './RawProcessor';
import { SandpackProcessor } from './SandpackProcessor';

export class CodeNodeProcessorFactory {
    private static instance: CodeNodeProcessorFactory;

    private constructor() {}

    public static getInstance(): CodeNodeProcessorFactory {
        if (!CodeNodeProcessorFactory.instance) {
            CodeNodeProcessorFactory.instance = new CodeNodeProcessorFactory();
        }
        return CodeNodeProcessorFactory.instance;
    }

    private static getBrowserProcessor(
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
                return CodeNodeProcessorFactory.getBrowserProcessor(node, sandboxMeta, options);
            default:
                throw new Error('Unsupported runtime');
        }
    }
}
