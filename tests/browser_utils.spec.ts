import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Utils } from '../src/utils';

describe('Utils.parseCodeBlock', () => {
    it('应该解析react代码块并识别语言', () => {
        const result = Utils.parseCodeBlock('codesandbox=new');

        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
            },
        });
    });

    it('应该解析vue代码块并识别语言', () => {
        const result = Utils.parseCodeBlock('codesandbox=new');
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
            },
        });
    });

    it('应该返回undefined对于不匹配的格式', () => {
        const result = Utils.parseCodeBlock('codesandbox=new');
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
            },
        });
    });

    it('应该解析包含查询参数的代码块', () => {
        const result = Utils.parseCodeBlock('codesandbox=new?style=height:1000px;width:600px');
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
                style: 'height:1000px;width:600px',
            },
        });
    });

    it('应该正确处理多个查询参数', () => {
        const result = Utils.parseCodeBlock(
            'codesandbox=new?style=height:1000px;width:600px&action=edit',
        );
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
                style: 'height:1000px;width:600px',
                action: 'edit',
            },
        });
    });

    it('应该正确处理包含等号的值', () => {
        const result = Utils.parseCodeBlock('codesandbox=new?style=height:100%25;width:50%25');
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
                style: 'height:100%25;width:50%25',
            },
        });
    });

    it('对于未知的语言应该返回undefined', () => {
        const result = Utils.parseCodeBlock('codesandbox=new');
        expect(result).to.deep.equal({
            codesandbox: {
                id: 'new',
            },
        });
    });

    it('没有codesandbox指令应该返回undefined', () => {
        const result = Utils.parseCodeBlock('```react');
        expect(result).to.be.undefined;
    });
});
