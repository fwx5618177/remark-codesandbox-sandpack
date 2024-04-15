import { CodeNode, Options, ParsedProps } from '../ICodeSandBox';
export declare class Utils {
    static parseCodeBlock: (meta: string) => ParsedProps | undefined;
    static processNodeForDisplay: (node: CodeNode, sandboxMeta: ParsedProps['codesandbox'], options: Options) => void;
}
