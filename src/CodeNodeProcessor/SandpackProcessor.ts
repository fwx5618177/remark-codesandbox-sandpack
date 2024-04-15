import { BaseCodeNodeProcessor } from './BaseCodeNodeProcessor';

export class SandpackProcessor extends BaseCodeNodeProcessor {
    override process(): void {
        const { mode } = this.options;
        // const renderAdapter = new RenderAdapter();
        // const render = renderAdapter.render(this.node, this.options);
        const env = typeof window !== 'undefined' ? 'browser' : 'node';

        switch (mode || 'button') {
            case 'iframe':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-sandpack': JSON.stringify(this.sandboxMeta),
                        'data-mode': 'iframe',
                        // 'data-html': render,
                        'data-env': env,
                        'data-type': 'sandpack',
                    },
                };

                break;
            case 'metadata':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        'data-codesandbox': JSON.stringify(this.sandboxMeta),
                        // 'data-html': render,
                        'data-env': env,
                        'data-type': 'sandpack',
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
                        // 'data-html': render,
                        'data-env': env,
                        'data-type': 'sandpack',
                    },
                };
                break;
        }
    }
}
