import fs from 'graceful-fs';
import { join, parse, relative } from 'path';
import { promisify } from 'util';
import prompt from 'prompts';
import exit from 'exit';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export async function generateReactComponent() {
  const input = await prompt({ name: 'tagName', type: 'text', message: 'input name' });

  const base: Extension = await chooseBase();

  const filesToGenerate: Extension[] = await chooseFilesToGenerate(base);
}

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

const chooseFilesToGenerate = async (base: Extension) =>
  (
    await prompt({
      name: 'filesToGenerate',
      type: 'multiselect',
      message: 'which files would you like to generate?',
      choices: [
        { value: 'css', title: 'Stylesheet (.css)', selected: true },
        { value: 'scss', title: 'Scss Stylesheet (.scss)', selected: true },
        { value: `test.${base}`, title: `React test (.test.${base})`, selected: true },
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
    case 'test.jsx':
      return;
    case 'test.tsx':
      return;
    default:
      throw new Error(`Unknown extension ${extension}`);
  }
};

type Extension = 'jsx' | 'tsx' | 'css' | 'scss' | 'test.jsx' | 'test.tsx';
