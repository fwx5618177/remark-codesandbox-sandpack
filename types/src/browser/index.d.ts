import { CodeNode, Options } from '../ICodeSandBox';
declare const remarkSandpack: (options: Options) => (tree: CodeNode) => void;
export default remarkSandpack;
