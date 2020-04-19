#!/usr/bin/env node

import program, {CommandOptions, Option} from 'commander';
import logSymbols from "log-symbols";
import {generateReactComponent} from "./generate";

program
    .arguments('[components...]')
    .version('1.0.0')
    .description('Easily generate react components')
    .option('-p, --path <componentsPath>', 'specify components directory')
    .option('-t, --no-template', 'disable default component template')
    .action(async (components: string[]) => {
        console.log(logSymbols.info, 'Selected options:');
        console.log(program.opts());
        await generateReactComponent(program.opts(), components);
    })
    .parse(process.argv);