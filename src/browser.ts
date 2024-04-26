import { getRuntimeEnv } from './runtimeEnv';
import { sandpack2Template } from './htmlTemplate';
import { CodeNode, ParsedProps } from './type';

export function getSandpack(node: CodeNode, sandboxMeta: ParsedProps['codesandbox']) {
    const { theme, mode, type, name } = sandboxMeta;
    const language = node?.lang;
    const content = node?.value;

    const sandConfig = {
        files: {
            [(name as string) || 'App.js']: {
                code: content,
            },
        },
        template: language || ('react-ts' as any),
        theme: theme || ('dark' as any),
        options: {
            showNavigator: true,
            showTabs: true,
            showLineNumbers: true,
            showReadOnly: true,
            externalResources: ['https://cdn.tailwindcss.com'],
            autoReload: true,
            autorun: true,
            initMode: 'user-visible',
            initModeObserverOptions: { rootMargin: `1000px 0px` },
            editorHeight: 500,
            activeFile: name,
        },
    };

    const html = sandpack2Template(sandConfig);

    node.data = {
        hProperties: {
            env: getRuntimeEnv(),
            type: type || 'html',
            mode: mode || 'sandpack',
            html,
        },
    };

    console.log(html);
}
