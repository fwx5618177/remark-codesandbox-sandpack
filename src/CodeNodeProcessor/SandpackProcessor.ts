import { RenderAdapter } from 'src/render/RenderAdapter';
import { BaseCodeNodeProcessor } from './BaseCodeNodeProcessor';

export class SandpackProcessor extends BaseCodeNodeProcessor {
    override process(): void {
        const { mode } = this.options;
        const renderAdapter = new RenderAdapter();
        const render = renderAdapter.render(this.node, {
            ...this.options,
            ...this.sandboxMeta,
            template: this.node.lang,
        });

        const env = typeof window !== 'undefined' ? 'browser' : 'node';

        switch (mode || 'button') {
            case 'iframe':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        sandpack: JSON.stringify(this.sandboxMeta),
                        mode: 'iframe',
                        html: render,
                        env: env,
                        type: 'sandpack',
                    },
                };

                break;
            case 'metadata':
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        sandpack: JSON.stringify(this.sandboxMeta),
                        html: render,
                        env: env,
                        type: 'sandpack',
                    },
                };
                break;
            case 'button':
            default:
                this.node.data = {
                    hProperties: {
                        ...(this.node.data?.hProperties || {}),
                        sandpack: JSON.stringify(this.sandboxMeta),
                        mode: 'button',
                        html: render,
                        env: env,
                        type: 'sandpack',
                    },
                };
                break;
        }
    }
}
