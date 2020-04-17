#!/usr/bin/env node

import program from 'commander';
import path from 'path';
import { generateReactComponent } from './generate';

program
    .version('1.0.0')
    .description('Easily generate react components')
    .option('-p, --path', 'specify components directory')
    .option('-t, --no-template', 'disable default component template')
    .action(async (options: any) => {
      await generateReactComponent();
    })
    .parse(process.argv);

const populateConfigFile = async (options: any) => {
    return;
};