// @ts-nocheck
import { expect } from 'chai';
import { describe, it, before } from 'mocha';

import { parseCodeBlock, processNodeForDisplay } from '../src/utils';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { remark } from 'remark';
import { fileURLToPath } from 'url';
import remarkSandpack from '../src';
import { visit } from 'unist-util-visit';
import { CodeNode } from 'remark-codesandbox-sandpack';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Utils', () => {
    describe('parseCodeBlock', () => {
        it('should return undefined when meta is empty', () => {
            // Arrange
            const meta = '';
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.be.undefined;
        });

        it('should return undefined when meta does not match pattern', () => {
            // Arrange
            const meta = 'codesandbox';
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.be.undefined;
        });

        it('should return parsed props when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should return parsed props with style when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                    style: 'height:1000px;width:600px',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should return parsed props with multiple styles when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                    style: 'height:1000px;width:600px',
                    theme: 'dark',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should return parsed props with multiple styles when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                    style: 'height:1000px;width:600px',
                    theme: 'dark',
                    mode: 'button',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should return parsed props with multiple styles when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button&type=sandpack',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                    style: 'height:1000px;width:600px',
                    theme: 'dark',
                    mode: 'button',
                    type: 'sandpack',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should return parsed props with multiple styles when meta matches pattern', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button&type=sandpack',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = parseCodeBlock(meta);
            // Assert
            expect(result).to.deep.equal({
                codesandbox: {
                    action: 'new',
                    style: 'height:1000px;width:600px',
                    theme: 'dark',
                    mode: 'button',
                    type: 'sandpack',
                },
                ParseMetaLanguage: 'react',
            });
        });

        it('should throw an error when invalid key is found', () => {
            // Arrange
            const meta = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button&type=sandpack&invalidKey=invalidValue',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = () => parseCodeBlock(meta);
            // Assert
            expect(result).to.throw('Invalid key: invalidKey');
        });

        it('should throw an error when invalid key is found', () => {
            // Arrange
            const meta = {
                type: 'code',
                lang: 'angular',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=button&type=sandpack&invalidKey=invalidValue',
                value: 'console.log("Hello, World!")',
            };
            // Act
            const result = () => parseCodeBlock(meta);
            // Assert
            expect(result).to.throw('Invalid key: invalidKey');
        });
    });

    describe('processNodeForDisplay', () => {
        it('should process the node for display button', () => {
            // Arrange
            const node = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=sandpack&type=jsx',
                value: 'console.log("Hello, World!")',
            };
            const sandboxMeta = {
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
            // Act
            const result = processNodeForDisplay(node, sandboxMeta, options);
            // Assert
            expect(result).to.be.undefined;
        });

        it('should process the node for display sandpack', () => {
            const node = {
                lang: 'react',
                meta: 'codesandbox=new?style=height:1000px;width:600px&theme=dark&mode=sandpack&type=jsx',
                value: 'console.log("Hello, World!")',
            };
            const sandboxMeta = {
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
            expect(result).to.be.undefined;
        });
    });

    describe('read file', () => {
        let markdownContent: string | undefined;

        before(() => {
            try {
                markdownContent = readFileSync(join(__dirname, '__mock__', 'test.md'), 'utf-8');
            } catch (error) {
                console.error('Error reading local test file:', error);
            }
        });

        it('should read the test file', () => {
            const ast = remark().parse(markdownContent);

            remark()
                .use(remarkSandpack, { mode: 'iframe', runtime: 'browser', type: 'sandpack' })
                .run(ast, (err, processedAst) => {
                    if (err) throw err;

                    visit(processedAst as CodeNode, 'code', (node: CodeNode) => {
                        if (node.data && node.data.hProperties) {
                            const { html, mode: dataMode } = node.data.hProperties;

                            expect(dataMode).to.equal('sandpack');
                            expect(html).to.be.a('string');
                            expect(html).includes('<body');
                        }
                    });
                });
        });
    });
});
