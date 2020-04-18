import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';
import {getComponentBoilerplate, getTestBoilerplate} from "./boilerplates";
import {Option} from "commander";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent(components: string[]) {
    
    if (components.length === 0) {
        components = (await prompt({
            name: 'components',
            type: 'text',
            message: 'Enter component name(s):',
            format: formatInput,
            validate: validateInput,
            onState: handleState
        })).components as string[];
    }

    const language: Extension = await chooseLanguage();

    const stylesheet: Extension = await chooseStylesheet();

    const filesToGenerate: Extension[] = [...(await chooseFilesToGenerate(language, stylesheet))];
    
    const stylesheetSelected: boolean = filesToGenerate.some((file: string) => {
       return ( file === 'css' || file === 'scss' || file === 'sass');
    });
    
    for(let component of components) {
        const outDir = join('components', component);
        await mkdir(outDir, { recursive: true} );

        const writtenFiles = await Promise.all(
            filesToGenerate.map(extension => writeFileByExtension(outDir, component, extension, stylesheetSelected ? stylesheet : undefined)));

        if (!writtenFiles) {
            return exit(-1);
        }
    }
    
    console.log();
    console.log(`The following files have been generated:`);
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

const writeFileByExtension = async (path: string, name: string, extension: Extension,stylesheet?: Extension) => {
    const outFile = join(path, `${name}.${extension}`);
    const boilerplate = getBoilerplateByExtension(name, extension, stylesheet);

    await writeFile(outFile, boilerplate, { flag: 'wx' });

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
    return val.split(' ');
};

const handleState = (state: any) => {
    if (state.aborted) {
        exit(-1);
    }
};

const validateInput = (input: string) => {
    if(input === '') {
        return "Name of component may not be empty!";
    }
    return true;
};

export type Extension = 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'scss' | 'sass' | 'test.js' | 'test.ts';
