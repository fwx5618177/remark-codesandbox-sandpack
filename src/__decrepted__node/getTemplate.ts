import fetch from 'isomorphic-fetch';
import { IFiles } from 'codesandbox-import-utils/lib/api/define';
import { ITemplate } from 'codesandbox-import-util-types';

interface FileMappings {
    [shortid: string]: {
        directory_shortid?: string;
        title: string;
        code?: string;
    };
}

interface Template {
    files: IFiles;
    directories: Array<{ shortid: string; title: string }>;
    modules: Array<{ shortid: string; code: string; directory_shortid?: string; title: string }>;
    title: string;
    query: string;
    extends: string;
    entry: string;
}

// 合并两个模板，其中目标模板会覆盖基础模板中的相同文件
export function mergeTemplates(baseTemplate: Template, targetTemplate: Template): Template {
    return {
        ...baseTemplate,
        ...targetTemplate,
        files: {
            ...(baseTemplate.files || {}),
            ...(targetTemplate.files || {}),
        },
    };
}

// 根据映射和shortid获取文件路径
export function getFilePath(mappings: FileMappings, shortid: string): string | null {
    const dir = mappings[shortid];

    if (!dir) {
        return null;
    }

    return [getFilePath(mappings, dir.directory_shortid!), dir.title].filter(Boolean).join('/');
}

// 获取模板，可以是预定义的模板ID，来自文件系统的模板或者是自定义的模板
export async function getTemplate(
    templateID: ITemplate,
    customTemplates: { [x: string]: any },
    file?: { dirname: string },
): Promise<Template> {
    if (customTemplates[templateID]) {
        const baseTemplate = await getTemplate(
            customTemplates[templateID].extends,
            customTemplates,
            file,
        );

        const template = mergeTemplates(baseTemplate, customTemplates[templateID]);

        return template;
    }

    let template: Template;

    if (templateID.startsWith('file:')) {
        if (typeof window !== 'undefined') {
            throw new Error('"file:" template is not supported in browser environment!');
        }

        const directoryPath = templateID.slice('file:'.length);
        template = await require('./fsTemplate')(
            directoryPath,
            file ? file.dirname : process.cwd(),
        );
    } else {
        try {
            const response = await fetch(`https://codesandbox.io/api/v1/sandboxes/${templateID}`);
            const responseData = await response.json();

            template = responseData.data;
        } catch (err) {
            console.error(`Failed to get the sandbox template: ${templateID}`);
            throw err;
        }

        const mappings: FileMappings = {};

        template.directories?.forEach(dir => {
            mappings[dir.shortid] = dir;
        });
        template.modules?.forEach(file => {
            mappings[file.shortid] = file;
        });

        const files: Template['files'] = {};

        template.modules?.forEach(file => {
            const path = getFilePath(mappings, file.shortid);

            if (path) {
                files[path] = { content: file.code, isBinary: false };
            }
        });

        template.files = files;
    }

    return template;
}

// 从缓存中获取模板，如果没有则加载模板并缓存
export async function getTemplateFromCache(
    templates: Map<string, Promise<Template>>,
    templateID: ITemplate,
    customTemplates: { [x: string]: any },
    file?: { dirname: string },
): Promise<Template> {
    if (!templates.has(templateID)) {
        templates.set(templateID, getTemplate(templateID, customTemplates, file));
    }

    return templates.get(templateID)!;
}
