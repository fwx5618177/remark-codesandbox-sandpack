import React from 'react';
import { SandpackExtendProps } from 'src/ICodeSandBox';
import { Sandpack } from '@codesandbox/sandpack-react';
// import '@codesandbox/sandpack-react/dist/index.css';

const SandpackTemplate: React.FC<SandpackExtendProps> = props => {
    return (
        <Sandpack {...props} theme={props.theme as SandpackExtendProps['theme'] as any}></Sandpack>
    );
};

export default SandpackTemplate;
