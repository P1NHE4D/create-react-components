import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';
import {getComponentBoilerplate, getTestBoilerplate} from "./boilerplates";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent(options: {[key: string]: any}, components: string[]) {
    
    if (components.length === 0) {
        components = (await prompt({
            name: 'components',
            type: 'text',
            message: 'Enter component name(s):',
            format: formatInput,
            validate: validateInput,
            onState: handleState
        })).components as string[];
    } else {
        const inputValid: string | boolean = validateInput(components.join(' '));
        if(typeof inputValid === "string") {
            console.log(inputValid);
            exit(-1);
        }
    }

    const language: Extension = await chooseLanguage();

    const stylesheet: Extension = await chooseStylesheet();

    const filesToGenerate: Extension[] = [...(await chooseFilesToGenerate(language, stylesheet))];
    
    const stylesheetSelected: boolean = filesToGenerate.some((file: string) => {
       return ( file === 'css' || file === 'scss' || file === 'sass');
    });
    
    for(let component of components) {
        const componentName = component.trim();
        const outDir = join('components', componentName);
        await mkdir(outDir, { recursive: true} );
        const createTemplates = options['template'] !== undefined ? options['template'] : true;

        const writtenFiles = await Promise.all(
            filesToGenerate.map(extension => writeFileByExtension(outDir, componentName, extension, createTemplates, stylesheetSelected ? stylesheet : undefined)));

        if (!writtenFiles) {
            return exit(-1);
        }
    }
    
    console.log(`\nThe following files have been generated:`);
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
            onState: handleState
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
            onState: handleState
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
                { value: `test.${language === 'jsx' ? 'js' : 'ts'}`, title: `Tests (.test.${language === 'jsx' ? 'js' : 'ts'})`, selected: true },
            ] as any[],
            onState: handleState
        })
    ).filesToGenerate as Extension[];

const writeFileByExtension = async (path: string, name: string, extension: Extension, createTemplates: boolean, stylesheet?: Extension) => {
    const outFile = join(path, `${name}.${extension}`);
    
    const boilerplate = createTemplates ? getBoilerplateByExtension(name, extension, stylesheet) : '';

    try {
        await writeFile(outFile, boilerplate, { flag: 'wx' });
    } catch (exception) {
        console.error('An unexpected error occured while writing the files.', exception.message);
        exit(-1);
    }

    return outFile;
};

const getBoilerplateByExtension = (componentName: string, extension: Extension, stylesheet?: Extension) => {
    switch (extension) {
        case 'jsx':
            return getComponentBoilerplate(componentName, stylesheet);
        case 'tsx':
            return getComponentBoilerplate(componentName, stylesheet);
        case 'test.js':
            return getTestBoilerplate(componentName);
        case 'test.ts':
            return getTestBoilerplate(componentName);
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

const validateInput = (input: string) => {
    //TODO: check, if file already exists
    if(input.trim() === '') {
        return "Name of component may not be empty!";
    }
    const names: string[] = input.trim().split(' ');
    if (new Set(names).size !== names.length) {
        return "Duplicates not allowed!";
    }
    return true;
};

export type Extension = 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'scss' | 'sass' | 'test.js' | 'test.ts';
