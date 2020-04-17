import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent() {
    const name: string = (await prompt({ 
        name: 'componentName', 
        type: 'text', 
        message: 'Component name:',
        validate: validateInput,
        onState: handleState
    })).componentName as string;
    
    const {dir, base: componentName} = parse(name);

    const base: Extension = await chooseBase();

    const stylesheet: Extension = await chooseStylesheet();

    const filesToGenerate: Extension[] = [base, ...(await chooseFilesToGenerate(base === 'jsx' ? 'js' : 'ts', stylesheet))];
    
    const outDir = join('components', dir, componentName);
    await mkdir(outDir, { recursive: true} );
    
    const writtenFiles = await Promise.all(
        filesToGenerate.map(extension => writeFileByExtension(outDir, componentName, extension))
    );
    
    if (!writtenFiles) {
        return exit(-1);
    }
    
    console.log();
    console.log(`The following files have been generated:`);
}

const chooseStylesheet = async () =>
    (
        await prompt({
            name: 'stylesheet',
            type: 'select',
            message: 'Pick stylesheet',
            choices: [
                { title: 'css', value: 'css' },
                { title: 'scss', value: 'scss' },
                { title: 'sass', value: 'sass' },
            ],
            initial: 1,
            onState: handleState
        })
    ).stylesheet as Extension;

const chooseBase = async () =>
    (
        await prompt({
            name: 'base',
            type: 'select',
            message: 'Pick base',
            choices: [
                { title: 'jsx', value: 'jsx' },
                { title: 'tsx', value: 'tsx' },
            ],
            initial: 1,
            onState: handleState
        })
    ).base as Extension;

const chooseFilesToGenerate = async (base: Extension, stylesheet: Extension) =>
    (
        await prompt({
            name: 'filesToGenerate',
            type: 'multiselect',
            message: 'Which files would you like to generate?',
            choices: [
                { value: `${stylesheet}`, title: `Stylesheet (.${stylesheet})`, selected: true },
                { value: `test.${base}`, title: `Tests (.test.${base})`, selected: true },
            ] as any[],
            onState: handleState
        })
    ).filesToGenerate as Extension[];

const writeFileByExtension = async (path: string, name: string, extension: Extension) => {
    const outFile = join(path, `${name}.${extension}`);
    //const boilerplate = getBoilerplateByExtension(name, extension);

    await writeFile(outFile, { flag: 'wx' });

    return outFile;
};

const getBoilerplateByExtension = (tagName: string, extension: Extension) => {
    switch (extension) {
        case 'jsx':
            return;
        case 'tsx':
            return;
        case 'css':
            return;
        case 'scss':
            return;
        case 'sass':
            return;
        case 'test.jsx':
            return;
        case 'test.tsx':
            return;
        default:
            throw new Error(`Unknown extension ${extension}`);
    }
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

type Extension = 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'scss' | 'sass' | 'test.jsx' | 'test.tsx';
