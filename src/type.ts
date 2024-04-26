import { Node } from 'unist';
import { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react';

export type Runtime = 'node' | 'browser';

export type Options = {
    mode?: 'button' | 'metadata' | 'skip' | 'sandpack';
};

export type Properties = keyof Options | 'env' | 'type' | 'html';

export interface CodeNode extends Node {
    lang: string;
    meta: string;
    value: string;
    data: {
        hProperties: {
            [key in Properties]?: string;
        };
    };
}

export type CodeAction = 'new';
export type CodeType = 'html' | 'external';
export type CodesandboxType = 'style' | 'theme' | 'mode' | 'type' | 'name' | 'external';

export interface ParsedProps {
    ParseMetaLanguage: SandpackPredefinedTemplate;
    codesandbox: {
        action: CodeAction;
    } & Partial<Record<CodesandboxType, string>>;
}
