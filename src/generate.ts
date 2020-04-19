import fs from 'graceful-fs';
import path, { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';
import { getComponentTemplate, getTestTemplate } from './template';
import logSymbols from "log-symbols";
import { bold, red } from 'kleur';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent(options: { [key: string]: any }, components: string[]) {
    const dir = 'components'; // TODO: set to user defined directory if set
    if (components.length === 0) {
        components = (
            await prompt({
                name: 'components',
                type: 'text',
                message: 'Enter component name(s):',
                format: formatInput,
                validate: (input) => {
                    return validateInput(input, dir);
                },
                onState: handleState,
            })
        ).components as string[];
    } else {
        const inputValid: string | boolean = await validateInput(components.join(' '), dir);
        if (typeof inputValid === 'string') {
            console.log(inputValid);
            exit(-1);
        }
    }

    const language: Extension = await chooseLanguage();

    const stylesheet: Extension = await chooseStylesheet();

    const filesToGenerate: Extension[] = [...(await chooseFilesToGenerate(language, stylesheet))];

    const stylesheetSelected: boolean = filesToGenerate.some((file: string) => {
        return file === 'css' || file === 'scss' || file === 'sass';
    });

    let writtenFiles: any[] = [];
    for (const component of components) {
        const componentName = component.trim();
        const outDir = join('components', componentName);
        await mkdir(outDir, { recursive: true });

        const createTemplates = options.template !== undefined ? options.template : true;

        writtenFiles = writtenFiles.concat(await Promise.all(
            filesToGenerate.map((extension) =>
                writeFileByExtension(
                    outDir,
                    componentName,
                    extension,
                    createTemplates,
                    stylesheetSelected ? stylesheet : undefined,
                ),
            ),
        ));

        if (!writtenFiles) {
            return exit(-1);
        }
    }

    console.log();
    console.log(logSymbols.info, bold('The following files have been generated:'));
    writtenFiles.map(file => console.log(`- ${relative(dir, file)}`));
    console.log();
    console.log(logSymbols.success, bold('Done'));
}

const chooseLanguage = async () =>
    (
        await prompt({
            name: 'language',
            type: 'select',
            message: 'Select language',
            choices: [
                { title: 'JavaScript (.jsx)', value: 'jsx' },
                { title: 'TypeScript (.tsx)', value: 'tsx' },
            ],
            initial: 1,
            onState: handleState,
        })
    ).language as Extension;

const chooseStylesheet = async () =>
    (
        await prompt({
            name: 'stylesheet',
            type: 'select',
            message: 'Select stylesheet language',
            choices: [
                { title: 'css', value: 'css' },
                { title: 'scss', value: 'scss' },
                { title: 'sass', value: 'sass' },
            ],
            initial: 1,
            onState: handleState,
        })
    ).stylesheet as Extension;

const chooseFilesToGenerate = async (language: Extension, stylesheet: Extension) =>
    (
        await prompt({
            name: 'filesToGenerate',
            type: 'multiselect',
            message: 'Which files would you like to generate?',
            choices: [
                { value: `${language}`, title: `Component file (.${language})`, selected: true },
                { value: `${stylesheet}`, title: `Stylesheet (.${stylesheet})`, selected: true },
                {
                    value: `test.${language === 'jsx' ? 'js' : 'ts'}`,
                    title: `Tests (.test.${language === 'jsx' ? 'js' : 'ts'})`,
                    selected: true,
                },
            ] as any[],
            onState: handleState,
        })
    ).filesToGenerate as Extension[];

const writeFileByExtension = async (
    path: string,
    name: string,
    extension: Extension,
    createTemplates: boolean,
    stylesheet?: Extension,
) => {
    const outFile = join(path, `${name}.${extension}`);

    const template = createTemplates ? getTemplateByExtension(name, extension, stylesheet) : '';

    try {
        await writeFile(outFile, template, { flag: 'wx' });
    } catch (exception) {
        console.error(logSymbols.error, bold().red(`An unexpected error occured while writing the files. ${exception.message}`));
        exit(-1);
    }

    return outFile;
};

const getTemplateByExtension = (componentName: string, extension: Extension, stylesheet?: Extension) => {
    switch (extension) {
        case 'jsx':
            return getComponentTemplate(componentName, stylesheet);
        case 'tsx':
            return getComponentTemplate(componentName, stylesheet);
        case 'test.js':
            return getTestTemplate(componentName);
        case 'test.ts':
            return getTestTemplate(componentName);
        default:
            return '';
    }
};

const formatInput = (val: string) => {
    val = val.trim();
    return val.split(' ');
};

const handleState = (state: any) => {
    if (state.aborted) {
        exit(-1);
    }
};

const validateInput = (input: string, outDir: string) => {
    if (input.trim() === '') {
        return 'Name of component may not be empty!';
    }
    const names: string[] = input.trim().split(' ');
    if (new Set(names).size !== names.length) {
        return 'Duplicates not allowed!';
    }
    for (const name of names) {
        if (fs.existsSync(path.join(outDir, name))) {
            return 'Component already exists!';
        }
    }
    return true;
};

export type Extension = 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'scss' | 'sass' | 'test.js' | 'test.ts';
