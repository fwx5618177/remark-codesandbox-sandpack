declare module 'remark-codesandbox-newest' {
    import type { ComponentProps } from 'react';
    import { Sandpack } from '@codesandbox/sandpack-react';
    import type { SandpackThemeProp } from '@codesandbox/sandpack-react';
    import type { Node } from 'unist';

    export type Options = {
        mode?: 'button' | 'iframe' | 'metadata';
        runtime?: 'node' | 'browser';
        type?: 'sandpack' | 'raw' | 'codesandbox';
    };

    export type SandpackProps = ComponentProps<typeof Sandpack>;

    export type SandpackExtendProps = Omit<SandpackProps, 'theme'> & {
        theme: SandpackThemeProp | ThemeEnum;
    };

    export enum ThemeEnum {
        Amethyst = 'amethyst',
        AquaBlue = 'aquaBlue',
        AtomDark = 'atomDark',
        Cobalt2 = 'cobalt2',
        Cyberpunk = 'cyberpunk',
        Dracula = 'dracula',
        EcoLight = 'ecoLight',
        FreeCodeCampDark = 'freeCodeCampDark',
        GithubLight = 'githubLight',
        GruvboxDark = 'gruvboxDark',
        GruvboxLight = 'gruvboxLight',
        LevelUp = 'levelUp',
        MonokaiPro = 'monokaiPro',
        NeoCyan = 'neoCyan',
        NightOwl = 'nightOwl',
        SandpackDark = 'sandpackDark',
    }

    export type RenderOptions = SandpackExtendProps;

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
        // language: ParseMetaLanguage;
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

    export interface IRender {
        render(node: CodeNode, options?: RenderOptions): string;
    }
}
