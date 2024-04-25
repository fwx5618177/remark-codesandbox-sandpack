import { CodeNode, Options, ParsedProps, Runtime } from 'remark-codesandbox-sandpack';

import { getSandpack } from './browser';

const runtimeEnv: Runtime = typeof window !== 'undefined' ? 'browser' : 'node';

export const getRuntimeEnv = () => runtimeEnv;

export function getRuntimeProcessor(
    node: CodeNode,
    sandboxMeta: ParsedProps['codesandbox'],
    options: Options,
) {
    const { mode } = options || sandboxMeta['mode'] || { mode: 'sandpack' };

    switch (mode) {
        case 'sandpack':
        default:
            return getSandpack(node, sandboxMeta);
    }
}
