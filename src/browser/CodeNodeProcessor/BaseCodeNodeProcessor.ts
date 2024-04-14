import { CodeNode, ICodeNodeProcessor, Options, ParsedProps } from '../../ICodeSandBox';

export class BaseCodeNodeProcessor implements ICodeNodeProcessor {
    node: CodeNode;
    sandboxMeta: ParsedProps['codesandbox'];
    options: Options;

    constructor(node: CodeNode, sandboxMeta: ParsedProps['codesandbox'], options: Options) {
        this.node = node;
        this.sandboxMeta = sandboxMeta;
        this.options = options;
    }

    process() {
        throw new Error('Method "process()" must be implemented.');
    }
}
