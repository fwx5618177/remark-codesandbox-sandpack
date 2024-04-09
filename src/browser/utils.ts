import { CodeNodeProcessorFactory } from './CodeNodeProcessor/CodeNodeProcessorFactory';
import { CodeNode, CodesandboxType, Options, ParseMetaLanguage, ParsedProps } from './IBrowser';

export class Utils {
    /**
     * 解析代码块中的codesandbox指令，提取选项
     * @description
     * * 代码块中的codesandbox指令格式为:
     * * 1. ` ```[react|vue|angular] codesandbox=new`
     * * 2. ` ```[react|vue|angular] codesandbox=new?style=height:1000px;width:600px`
     * @param {string} meta
     * @returns {ParsedProps | undefined} 返回匹配到的类型，如果没有匹配到返回undefined
     */
    static parseCodeBlock = (meta: string): ParsedProps | undefined => {
        console.log({ meta });
        if (!meta) return;

        const pattern = /(react|vue|angular)\s+codesandbox=([^?\s]+)(\?.*)?$/;
        const match = meta.match(pattern);

        if (!match) return;

        const language = match[1] as ParseMetaLanguage;
        const codesandboxMetaType = match[2];
        const codesandboxMeta = match[3] ? match[3].substring(1) : '';
        const codesandbox: Partial<ParsedProps['codesandbox']> = {};

        if (codesandboxMetaType) {
            codesandbox.template = codesandboxMetaType;
        }

        codesandboxMeta.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                codesandbox[key as CodesandboxType] = value;
            }
        });

        const props = {
            language,
            codesandbox: codesandbox as Required<ParsedProps['codesandbox']>,
        } as const satisfies ParsedProps;

        return props;
    };

    static processNodeForDisplay = (
        node: CodeNode,
        sandboxMeta: ParsedProps['codesandbox'],
        options: Options,
    ) => {
        const process = CodeNodeProcessorFactory.getProcessor(node, sandboxMeta, options);

        process.process();
    };
}
