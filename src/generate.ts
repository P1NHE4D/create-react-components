import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent() {
  const name: string = (await prompt({ name: 'componentName', type: 'text', message: 'Component name:' })).componentName as string;

  // TODO: Validate name - must not be an empty string
  
  const base: Extension = await chooseBase();
  
  const stylesheet: Extension = await chooseStylesheet();

  const filesToGenerate: Extension[] = [base, ...(await chooseFilesToGenerate(base, stylesheet))];
}

const chooseStylesheet = async () => (
    await prompt({
        name: 'stylesheet',
        type: 'select',
        message: 'Pick stylesheet',
        choices: [
            { title: 'css', value: 'css'},
            { title: 'scss', value: 'scss'},
            { title: 'sass', value: 'sass'}
        ],
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
    })
  ).filesToGenerate as Extension[];

const writeFileByExtension = async (path: string, name: string, extension: Extension) => {
  const outFile = join(path, `${name}.${extension}`);
  const boilerplate = getBoilerplateByExtension(name, extension);

  await writeFile(outFile, boilerplate, { flag: 'wx' });

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

type Extension = 'jsx' | 'tsx' | 'css' | 'scss' | 'sass' | 'test.jsx' | 'test.tsx';
