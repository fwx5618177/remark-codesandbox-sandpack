import { CodeNode, ICodeNodeProcessor, Options, ParsedProps } from '../../ICodeSandBox';
export declare class BaseCodeNodeProcessor implements ICodeNodeProcessor {
    node: CodeNode;
    sandboxMeta: ParsedProps['codesandbox'];
    options: Options;
    constructor(node: CodeNode, sandboxMeta: ParsedProps['codesandbox'], options: Options);
    process(): void;
}
