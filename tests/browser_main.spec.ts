import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { remark } from 'remark';
import { unified } from 'unified';
import markdown from 'remark-parse';
import reactMarkdown from 'react-markdown';
import { Node } from 'unist';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { visit } from 'unist-util-visit';

import remarkSandpack from '../src/browser';
import { CodeNode } from '../src/ICodeSandBox';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('remarkSandpack', () => {
    describe('Options', () => {
        it('should process code blocks with remark', async () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'button' }).parse(input);
            const result = processor.children[0] as CodeNode;
            expect(result.meta).to.include('code block content');
            expect(result.value).to.include('121313\n131231');
            expect(result.lang).to.be.equal('js');
        });

        it('should process code blocks with remark', () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'iframe' }).parse(input);
            const result = processor.children[0] as CodeNode;
            expect(result.meta).to.include('code block content');
            expect(result.value).to.include('121313\n131231');
            expect(result.lang).to.be.equal('js');
        });

        it('should process code blocks with remark', () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'metadata' }).parse(input);
            const result = processor.children[0] as CodeNode;
            expect(result.meta).to.include('code block content');
            expect(result.value).to.include('121313\n131231');
            expect(result.lang).to.be.equal('js');
        });
    });

    describe('remarkSandpack Plugin', () => {
        let markdownContent: string | undefined;

        before(() => {
            // const { window } = new JSDOM('');
            // global.window = window;

            try {
                markdownContent = readFileSync(join(__dirname, '__mock__', 'test.md'), 'utf-8');
            } catch (error) {
                console.error('Error reading local test file:', error);
            }
        });

        it('should correctly transform nodes based on remarkSandpack', async () => {
            const ast = remark().parse(markdownContent);

            remark()
                .use(remarkSandpack, { mode: 'iframe', runtime: 'browser', type: 'sandpack' })
                .run(ast, (err, processedAst) => {
                    if (err) throw err;

                    visit(processedAst as Node, 'code', (node: CodeNode) => {
                        console.log(node);
                        if (node.data && node.data.hProperties) {
                            const { 'data-sandpack': dataSandpack, 'data-mode': dataMode } =
                                node.data.hProperties;

                            expect(dataMode).to.equal('iframe');
                            expect(dataSandpack).to.be.a('string');
                            expect(JSON.parse(dataSandpack as string)).to.be.an('object');
                        }
                    });
                });
        });

        it('should correctly transform nodes based on remarkSandpack', async () => {
            const ast = remark().parse(markdownContent);

            remark()
                .use(remarkSandpack, { mode: 'iframe', runtime: 'browser', type: 'sandpack' })
                .run(ast, (err, processedAst) => {
                    if (err) throw err;

                    visit(processedAst as Node, 'code', (node: CodeNode) => {
                        console.log(node);
                        if (node.data && node.data.hProperties) {
                            const { 'data-sandpack': dataSandpack, 'data-mode': dataMode } =
                                node.data.hProperties;

                            expect(dataMode).to.equal('iframe');
                            expect(dataSandpack).to.be.a('string');
                            expect(JSON.parse(dataSandpack as string)).to.be.an('object');
                        }
                    });
                });
        });
    });
});
