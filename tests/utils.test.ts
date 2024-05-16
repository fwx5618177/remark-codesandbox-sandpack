import { strict as assert } from 'assert';
import test from 'node:test';
import { parseCodeBlock, processNodeForDisplay } from '../src/utils.ts';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { remark } from 'remark';
import { fileURLToPath } from 'url';
import remarkSandpack from '../src/index.ts';
import { visit } from 'unist-util-visit';
import type { CodeNode, ParsedProps } from '../src/type.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('parseCodeBlock: should return undefined when meta is empty', t => {
    const meta = '' as unknown as CodeNode;
    const result = parseCodeBlock(meta);
    assert.strictEqual(result, undefined);
});

test('parseCodeBlock: should return undefined when meta does not match pattern', t => {
    const meta = 'codesandbox' as unknown as CodeNode;
    const result = parseCodeBlock(meta);
    assert.strictEqual(result, undefined);
});

test('parseCodeBlock: should return parsed props when meta matches pattern', t => {
    const meta: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    const result = parseCodeBlock(meta);
    assert.deepStrictEqual(result, {
        codesandbox: {
            action: 'new',
        },
        ParseMetaLanguage: 'react',
    });
});

test('parseCodeBlock: should return parsed props with style when meta matches pattern', t => {
    const meta: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new?style=height:1000px;width:600px',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    const result = parseCodeBlock(meta);
    assert.deepStrictEqual(result, {
        codesandbox: {
            action: 'new',
            style: 'height:1000px;width:600px',
        },
        ParseMetaLanguage: 'react',
    });
});

test('parseCodeBlock: should return parsed props with multiple styles when meta matches pattern', t => {
    const meta: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    const result = parseCodeBlock(meta);
    assert.deepStrictEqual(result, {
        codesandbox: {
            action: 'new',
            style: 'height:1000px;width:600px',
            theme: 'dark',
        },
        ParseMetaLanguage: 'react',
    });
});

test('parseCodeBlock: should throw an error when invalid key is found', t => {
    const meta: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button&type=sandpack&invalidKey=invalidValue',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    assert.throws(() => parseCodeBlock(meta), /Invalid key: invalidKey/);
});

test('processNodeForDisplay: should process the node for display button', t => {
    const node: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=sandpack&type=jsx',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    const sandboxMeta: ParsedProps['codesandbox'] = {
        action: 'new',
        style: 'height:1000px;width:600px',
        theme: 'dark',
        mode: 'button',
        type: 'sandpack',
    };
    const options = {
        mode: 'button',
        type: 'sandpack',
    };
    const result = processNodeForDisplay(node, sandboxMeta, options);
    assert.strictEqual(result, undefined);
});

test('processNodeForDisplay: should process the node for display sandpack', t => {
    const node: CodeNode = {
        lang: 'react',
        meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=sandpack&type=jsx',
        value: 'console.log("Hello, World!")',
        data: {
            hProperties: {},
        },
        type: '',
    };
    const sandboxMeta: ParsedProps['codesandbox'] = {
        action: 'new',
        style: 'height:1000px;width:600px',
        theme: 'dark',
        mode: 'sandpack',
        type: 'jsx',
    };
    const options = {
        mode: 'sandpack',
    };
    const result = processNodeForDisplay(node, sandboxMeta, options);
    assert.strictEqual(result, undefined);
});

test('read file: should read the test file', async t => {
    let markdownContent: string | undefined;
    try {
        markdownContent = readFileSync(join(__dirname, '__mock__', 'test.md'), 'utf-8');
    } catch (error) {
        console.error('Error reading local test file:', error);
    }

    const ast = remark().parse(markdownContent);

    await new Promise<void>((resolve, reject) => {
        remark()
            .use(remarkSandpack, { mode: 'sandpack' })
            .run(ast, ((err: Error, processedAst: CodeNode) => {
                if (err) return reject(err);

                visit(processedAst as CodeNode, 'code', (node: CodeNode) => {
                    if (node.data && node.data.hProperties) {
                        const { html, mode: dataMode } = node.data.hProperties;
                        if (!html) assert.strictEqual(html, '');

                        assert.strictEqual(dataMode, 'sandpack');
                        assert.strictEqual(typeof html, 'string');
                        assert(html.includes('<body'));
                    }
                });
                resolve();
            }) as any);
    });
});
