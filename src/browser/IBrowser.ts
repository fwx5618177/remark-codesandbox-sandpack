import { Node } from 'unist';

export type Options = {
    mode?: 'button' | 'iframe' | 'metadata';
    runtime?: 'node' | 'browser';
    type?: 'sandpack' | 'raw' | 'codesandbox';
};

export interface CodeNode extends Node {
    lang: string;
    meta: string;
    value: string;
    data?: {
        hProperties?: {
            [key: string]: any; // 声明 hProperties 以存储 HTML 属性
        };
    };
}

export type CodesandboxType = 'style' | 'template' | 'action' | 'type';
export type ParseMetaLanguage = 'react' | 'vue' | 'angular' | 'js' | 'javascript';
export interface ParsedProps {
    language: ParseMetaLanguage;
    codesandbox: {
        [key in CodesandboxType]: string;
    };
}

export interface ICodeNodeProcessor {
    node: CodeNode;
    sandboxMeta: ParsedProps['codesandbox'];
    options: Options;

    process(): void;
}
