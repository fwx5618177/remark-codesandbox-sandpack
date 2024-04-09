import { Node } from 'unist';

export interface CustomTemplates {
    [key: string]: {
        extends: string;
        entry?: string;
    };
}

export interface CodeSandboxOptions {
    mode?: 'meta' | 'iframe' | 'button';
    customTemplates?: CustomTemplates;
    query?: Record<string, string>;
    /**
     * @deprecated Use `query` instead. This option will be removed in the upcoming version.
     */
    iframeQuery?: Record<string, string>;
    autoDeploy?: boolean;
}

export interface CodeNode extends Node {
    type: 'code';
    lang: string;
    value: string;
    meta: string;
    children: Node[];
    data: {
        hProperties: {
            [key: string]: string;
            dataCodesandboxUrl?: string;
        };
        codesandboxUrl: string;
    };
}

export interface MetaProps {
    [key: string]: string;
    codesandbox?: string;
}

export type Query = string | { [key: string]: string } | URLSearchParams | undefined;
