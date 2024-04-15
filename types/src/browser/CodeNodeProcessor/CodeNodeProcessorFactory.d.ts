import { CodeNode, Options, ParsedProps } from '../../ICodeSandBox';
import { NodeCodeNodeProcessor } from './NodeCodeNodeProcessor';
import { CodeSandboxProcessor } from './CodeSandboxProcessor';
import { RawProcessor } from './RawProcessor';
import { SandpackProcessor } from './SandpackProcessor';
export declare class CodeNodeProcessorFactory {
    private static instance;
    private constructor();
    static getInstance(): CodeNodeProcessorFactory;
    private static getBrowserProcessor;
    static getProcessor(node: CodeNode, sandboxMeta: ParsedProps['codesandbox'], options: Options): NodeCodeNodeProcessor | CodeSandboxProcessor | RawProcessor | SandpackProcessor;
}
