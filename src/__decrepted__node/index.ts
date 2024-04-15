// import { visit } from 'unist-util-visit';
// import { is } from 'unist-util-is';
// // import { toString } from 'mdast-util-to-string';
// import { u } from 'unist-builder';
// import { getParameters } from 'codesandbox-import-utils/lib/api/define';
// import fetch from 'isomorphic-fetch';
// import { ITemplate } from 'codesandbox-import-util-types';

// import { getTemplateFromCache } from './getTemplate';
// import { parseMeta, mergeQuery, toBasePath, mergeStyle } from './utils';
// import { CodeSandboxOptions, CustomTemplates, CodeNode } from './ICore';

// let URLSearchParams: typeof globalThis.URLSearchParams;
// if (typeof window === 'undefined') {
//     // URLSearchParams is added to the global object in node v10
//     URLSearchParams = global.URLSearchParams || require('url').URLSearchParams;
// } else {
//     URLSearchParams = window.URLSearchParams;
// }

// const DEFAULT_CUSTOM_TEMPLATES: CustomTemplates = {
//     react: {
//         extends: 'new',
//     },
//     'react-component': {
//         extends: 'new',
//         entry: 'src/App.js',
//     },
// };

// const PLUGIN_ONLY_QUERY_PARAMS = ['overrideEntry', 'entry', 'style'];

// function codesandbox(options: CodeSandboxOptions = {}) {
//     const templates = new Map<string, any>();
//     const mode = options.mode || 'meta';

//     const customTemplates = {
//         ...DEFAULT_CUSTOM_TEMPLATES,
//         ...(options.customTemplates || {}),
//     };
//     const defaultQuery: Record<string, string> | undefined =
//         mode === 'iframe'
//             ? {
//                   fontsize: '14px',
//                   hidenavigation: '1',
//                   theme: 'dark',
//               }
//             : undefined;
//     const autoDeploy = options.autoDeploy || false;

//     let baseQuery: URLSearchParams | undefined = defaultQuery
//         ? new URLSearchParams(defaultQuery)
//         : undefined;

//     if (typeof options.query !== 'undefined') {
//         baseQuery = new URLSearchParams(options.query);
//     } else if (typeof options.iframeQuery !== 'undefined') {
//         console.warn(
//             `options.iframeQuery is now deprecated and will be removed in the upcoming version, please use options.query instead.`,
//         );

//         baseQuery = new URLSearchParams(options.iframeQuery);
//     }

//     return async function transformer(tree: CodeNode, file: any) {
//         let title: string | undefined;
//         const codes: Array<[CodeNode, number, CodeNode]> = [];

//         // 遍历 AST，找到所有的代码块节点，并将这些节点及其索引和父节点存储在 `codes` 数组中
//         visit(tree, 'code', (node, index, parent) => {
//             // If the code block is a heading, we'll use it as the title
//             if (!title && is(node, ['heading', { depth: 1 }])) {
//                 title = toString(node);
//             } else if (is(node, 'code')) {
//                 if (typeof index === 'number' && parent) {
//                     codes.push([node, index, parent]);
//                 }
//             }
//         });

//         // 遍历 `codes` 数组中的每个节点，为每个节点生成一个 CodeSandbox 链接
//         for (const [node, _, parent] of codes) {
//             const meta = parseMeta(node.meta || '');
//             const sandboxMeta = meta?.codesandbox;

//             // 如果节点没有 `codesandbox` 元数据，跳过这个节点
//             if (!sandboxMeta) {
//                 continue;
//             }

//             const [templateID, queryString] = sandboxMeta.split('?');

//             // 获取 CodeSandbox 的模板
//             const template = await getTemplateFromCache(
//                 templates,
//                 templateID as ITemplate,
//                 customTemplates,
//                 file,
//             );
//             // 设置模板的标题
//             template.title = title || template.title;
//             // 合并查询参数
//             const query = mergeQuery(baseQuery, template.query, queryString);

//             // 获取入口文件的路径
//             const entryPath = query.has('entry')
//                 ? toBasePath(query.get('entry') as string)
//                 : template.entry;

//             // 如果没有预定义的 `module` 键，那么我们将其指定为入口文件
//             if (!query.has('module')) {
//                 query.set(
//                     'module',
//                     // `entry` 不以斜杠开头，但 `module` 需要它
//                     entryPath.startsWith('/') ? entryPath : `/${entryPath}`,
//                 );
//             }

//             const overrideEntry = query.get('overrideEntry');

//             const style = query.get('style') || '';

//             // 删除只对插件有用，对 CodeSandbox 无关的选项
//             PLUGIN_ONLY_QUERY_PARAMS.forEach(param => {
//                 query.delete(param);
//             });

//             // 如果入口文件不在模板中，抛出错误
//             if (!template.files[entryPath]) {
//                 throw new Error(`Entry "${entryPath}" is not present in template "${templateID}".`);
//             }

//             // 获取入口文件的内容
//             let entryFileContent = template.files[entryPath]!.content;
//             if (!overrideEntry) {
//                 entryFileContent = node.value;
//             } else if (overrideEntry !== 'false') {
//                 const [overrideRangeStart, overrideRangeEnd] = overrideEntry.split('-');

//                 const lines = entryFileContent.split('\n');
//                 entryFileContent = [
//                     ...lines.slice(0, Number(overrideRangeStart) - 1),
//                     node.value,
//                     ...(overrideRangeEnd === '' ? [] : lines.slice(Number(overrideRangeEnd))),
//                 ].join('\n');
//             }

//             // 获取参数
//             const parameters = getParameters({
//                 files: {
//                     ...template.files,
//                     [entryPath]: { content: entryFileContent, isBinary: false },
//                 },
//             });

//             let url;

//             // 如果启用了自动部署，获取 CodeSandbox 的链接
//             if (autoDeploy) {
//                 const { sandbox_id } = await fetch(
//                     'https://codesandbox.io/api/v1/sandboxes/define',
//                     {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ parameters, json: 1 }),
//                     },
//                 ).then(res => res.json());

//                 url = `https://codesandbox.io/s/${sandbox_id}?${query.toString()}`;
//             } else {
//                 url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}&${query.toString()}`;
//             }

//             // 根据模式插入按钮、iframe 或元数据
//             switch (mode) {
//                 case 'button': {
//                     const button = u('paragraph', [
//                         u('link', { url }, [
//                             u('image', {
//                                 url: 'https://codesandbox.io/static/img/play-codesandbox.svg',
//                                 alt: 'Edit on CodeSandbox',
//                             }),
//                         ]),
//                     ]);

//                     // Insert the button directly after the code block
//                     const index = parent.children.indexOf(node);
//                     parent.children.splice(index + 1, 0, button);

//                     break;
//                 }
//                 case 'iframe': {
//                     // Construct the iframe AST
//                     const iframe = u('html', {
//                         value: `<iframe
//                             src="${autoDeploy ? url.replace('/s/', '/embed/') : `${url}&embed=1`}"
//                             style="${mergeStyle(
//                                 'width:100%; height:500px; border:0; border-radius:4px; overflow:hidden;',
//                                 style,
//                             )}"
//                             title="${template.title || ''}"
//                             allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
//                             sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
//                           ></iframe>`,
//                     });

//                     // Replace the code block with the iframe
//                     const index = parent.children.indexOf(node);
//                     parent.children.splice(index, 1, iframe);

//                     break;
//                 }
//                 case 'meta':
//                 default: {
//                     // TODO: We might still want to make this happen regardless of the mode?
//                     node.data = node.data || {};
//                     node.data.hProperties = node.data.hProperties || {};

//                     node.data.codesandboxUrl = url;
//                     node.data.hProperties.dataCodesandboxUrl = url;

//                     break;
//                 }
//             }
//         }
//     };
// }

// export default codesandbox;
