import { BaseCodeNodeProcessor } from './BaseCodeNodeProcessor';

export class RawProcessor extends BaseCodeNodeProcessor {
    override process(): void {
        const { mode } = this.options;

        switch (mode) {
            case 'iframe':
                this.node.type = 'html';
                this.node.value = `<div data-sandpack-config='${JSON.stringify(this.sandboxMeta)}'></div>`;
                break;
            case 'metadata':
                // 仅添加元数据而不修改内容
                this.node.data = {
                    ...this.node.data,
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-codesandbox': JSON.stringify(this.sandboxMeta),
                    },
                };
                break;
            case 'button':
            default:
                this.node.type = 'html';
                this.node.value = `<div data-sandpack-config='${JSON.stringify(this.sandboxMeta)}'><button>Open in CodeSandbox</button></div>`;
                break;
        }
    }
}
