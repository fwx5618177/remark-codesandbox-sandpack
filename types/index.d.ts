declare module 'remark-codesandbox-newest' {
    import type { ComponentProps } from 'react';
    import { Sandpack } from '@codesandbox/sandpack-react';
    import { SandpackThemeProp } from '@codesandbox/sandpack-react/types';
    import { Node } from 'unist';
    import { Plugin } from 'unified';

    const remarkCodesandboxNewest: Plugin<[Options?]>;
    export = remarkCodesandboxNewest;

    type Options = {
        mode?: 'button' | 'iframe' | 'metadata';
        runtime?: 'node' | 'browser';
        type?: 'sandpack' | 'raw' | 'codesandbox';
    };

    type SandpackProps = ComponentProps<typeof Sandpack>;

    type SandpackExtendProps = Omit<SandpackProps, 'theme'> & {
        theme: SandpackThemeProp | ThemeEnum;
    };

    enum ThemeEnum {
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

    type RenderOptions = SandpackExtendProps;

    interface CodeNode extends Node {
        lang: string;
        meta: string;
        value: string;
        data?: {
            hProperties?: {
                [key: string]: any; // 声明 hProperties 以存储 HTML 属性
            };
        };
    }

    type CodesandboxType = 'style' | 'template' | 'action' | 'type';
    type ParseMetaLanguage = 'react' | 'vue' | 'angular' | 'js' | 'javascript';
    interface ParsedProps {
        // language: ParseMetaLanguage;
        codesandbox: {
            [key in CodesandboxType]: string;
        };
    }

    interface ICodeNodeProcessor {
        node: CodeNode;
        sandboxMeta: ParsedProps['codesandbox'];
        options: Options;

        process(): void;
    }

    interface IRender {
        render(node: CodeNode, options?: RenderOptions): string;
    }
}
