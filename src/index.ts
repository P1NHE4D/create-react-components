#!/usr/bin/env node

import program, {Option} from 'commander';
import path from 'path';
import { generateReactComponent } from './generate';

program
    .arguments('[components...]')
    .version('1.0.0')
    .description('Easily generate react components')
    .option('-p, --path <componentsPath>', 'specify components directory', '')
    .option('-t, --no-template', 'disable default component template')
    .action(async (components: string[]) => {
        await generateReactComponent(components);
    })
    .parse(process.argv);