import {
    CodeAction,
    CodeNode,
    CodesandboxType,
    Options,
    ParsedProps,
} from 'remark-codesandbox-sandpack';

import { getRuntimeProcessor } from './runtimeEnv';

const validKeys: CodesandboxType[] = ['style', 'theme', 'mode', 'type', 'name', 'external'];

/**
 * Parse the code block to extract the codesandbox meta
 * @param {CodeNode} node - The code node object
 * @returns {ParsedProps | undefined} - The parsed props if matched, otherwise undefined
 */
function parseCodeBlock(node: CodeNode): ParsedProps | undefined {
    if (!node) return;

    const meta = node?.meta;
    const lang = node?.lang as ParsedProps['ParseMetaLanguage'];
    const pattern = /codesandbox=([^?\s]+)(\?.*)?$/;
    const match = meta?.match(pattern);

    if (!match) return;

    const codesandboxMetaType = match[1];
    const codesandboxMeta = match[2] ? match[2].substring(1) : '';
    const codesandbox: ParsedProps['codesandbox'] = {
        action: codesandboxMetaType as CodeAction,
    };

    codesandboxMeta.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
            if (validKeys.includes(key as CodesandboxType)) {
                codesandbox[key as CodesandboxType] = value;
            } else {
                throw new Error(`Invalid key: ${key}`);
            }
        }
    });

    const props: ParsedProps = {
        codesandbox: codesandbox as Required<ParsedProps['codesandbox']>,
        ParseMetaLanguage: lang,
    };

    return props;
}

/**
 * Process the node for display
 * @param {CodeNode} node - Node Object
 * @param {ParsedProps['codesandbox']} sandboxMeta - Codesandbox Meta
 * @param {Options} options - 配置选项
 */
function processNodeForDisplay(
    node: CodeNode,
    sandboxMeta: ParsedProps['codesandbox'],
    options: Options,
) {
    getRuntimeProcessor(node, sandboxMeta, options);
}

export { parseCodeBlock, processNodeForDisplay, validKeys };
