import { BaseCodeNodeProcessor } from './BaseCodeNodeProcessor';

export class SandpackProcessor extends BaseCodeNodeProcessor {
    override process(): void {
        const { mode } = this.options;

        switch (mode || 'button') {
            case 'iframe':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-sandpack': JSON.stringify(this.sandboxMeta),
                        'data-mode': 'iframe',
                    },
                };

                console.log(this.node.data);
                break;
            case 'metadata':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-codesandbox': JSON.stringify(this.sandboxMeta),
                    },
                };
                break;
            case 'button':
            default:
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-sandpack': JSON.stringify(this.sandboxMeta),
                        'data-mode': 'button',
                    },
                };
                break;
        }
    }
}
