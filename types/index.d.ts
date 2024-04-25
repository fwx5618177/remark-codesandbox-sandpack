declare module 'remark-codesandbox-sandpack' {
    import { Node } from 'unist';
    import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';

    type Runtime = 'node' | 'browser';

    type Options = {
        mode?: 'button' | 'metadata' | 'skip' | 'sandpack';
    };

    type Properties = keyof Options | 'env' | 'type' | 'html';

    interface CodeNode extends Node {
        lang: string;
        meta: string;
        value: string;
        data: {
            hProperties: {
                [key in Properties]?: string;
            };
        };
    }

    type CodeAction = 'new';
    type CodeType = 'html' | 'external';
    type CodesandboxType = 'style' | 'theme' | 'mode' | 'type' | 'name' | 'external';

    interface ParsedProps {
        ParseMetaLanguage: SandpackPredefinedTemplate;
        codesandbox: {
            action: CodeAction;
        } & Partial<Record<CodesandboxType, string>>;
    }
}
