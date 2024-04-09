import { expect } from 'chai';
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

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('remarkSandpack', () => {
    describe('Options', () => {
        it('should process code blocks with remark', () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'button' });
            const result = processor.processSync(input).toString();

            expect(result).to.include('code block content');
        });

        it('should process code blocks with remark', () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'iframe' });
            const result = processor.processSync(input).toString();

            expect(result).to.include('code block content');
        });

        it('should process code blocks with remark', () => {
            const input = '```js code block content\n121313\n131231\n```';
            const processor = remark().use(remarkSandpack, { mode: 'metadata' });
            const result = processor.processSync(input).toString();

            expect(result).to.include('code block content');
        });
    });

    describe('remarkSandpack Plugin', () => {
        let markdownContent;

        before(() => {
            // 读取Markdown文件内容
            try {
                markdownContent = readFileSync(join(__dirname, '__mock__', 'test.md'), 'utf-8');
            } catch (error) {
                console.error('Error reading local test file:', error);
            }
        });

        it('should process code blocks with remark', () => {
            const processor = remark().use(remarkSandpack, { mode: 'button', runtime: 'browser' });
            const result = processor.processSync(markdownContent).toString();

            expect(result).not.be.false;
        });

        it('should correctly transform nodes based on remarkSandpack', async () => {
            const processedAst = remark()
                .use(remarkSandpack, { mode: 'iframe', runtime: 'browser', type: 'sandpack' })
                .parse(markdownContent);

            visit(processedAst, 'code', node => {
                // console.log(node);
                if (node.data && node.data.hProperties) {
                    const { 'data-sandpack': dataSandpack, 'data-mode': dataMode } =
                        node.data.hProperties;

                    // console.log(dataSandpack, dataMode);
                    expect(dataMode).to.equal('iframesssssss');
                    expect(dataSandpack).to.be.a('string');
                    // console.log(dataSandpack);
                    expect(JSON.parse(dataSandpack as string)).to.be.an('object');
                }
            });
        });
    });

    // it('should process code blocks with unified', () => {
    //     const input = '```js\ncode block content\n```';
    //     const processor = unified().use(parser).use(remarkSandpack, { mode: 'iframe' });
    //     const result = processor.processSync(input).toString();

    //     // 此处根据remarkSandpack的实际效果进行断言
    //     expect(result).to.include('code block content');
    // });

    // it('should process code blocks with react-markdown', () => {
    //     const input = '```js\ncode block content\n```';
    //     // 注意：react-markdown的使用略有不同，因为它直接在React组件中渲染Markdown
    //     // 可能需要根据实际实现调整此测试用例
    //     const result = reactMarkdown({
    //         children: input,
    //         remarkPlugins: [[remarkSandpack, { mode: 'metadata' }]],
    //     });

    //     // 由于react-markdown在客户端渲染，这里的测试需要根据实际输出结构进行断言
    //     // 此处假设您能够某种方式检查渲染结果
    //     expect(result).to.include('code block content');
    // });
});
