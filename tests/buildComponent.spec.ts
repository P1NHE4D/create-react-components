import '../src/buildComponent';
import * as path from "path";
import {buildReactComponent} from "../src/buildComponent";
import {getFunctionalJsxTemplate, getFunctionalTsxTemplate, getJsxTemplate, getTsxTemplate} from "../src/template";
import ErrnoException = NodeJS.ErrnoException;
const fs = require('fs-extra');
const prompts = require('prompts');
const mock = require('mock-fs');
const mockfsHelper = require('./mock-fs-helper');


const dir = 'components';
const options = {
    'template': true,
    'path': dir
};
const nodeModules = mockfsHelper.duplicateFSInMemory(path.resolve('node_modules'));
mock({
    'node_modules': nodeModules
});

const getFilePaths = async (components: string[], extensions: string[]) => {
    let paths: string[] = [];
    for (const comp of components) {
        for (const ext of extensions) {
            paths.push(path.join(dir, comp, comp.concat(`.${ext}`)));
        }
    }
    return paths;
};

describe('Build React Component', () => {
    
    afterEach(() => {
        if(fs.existsSync('components')) {
            fs.removeSync('components', {recursive: true});
        }
    });
    
    afterAll(() => {
        mock.restore();
    });
    
    
    it('should generate multiple components', async () => {
        const components = 'Menu Button Slider';
        const extensions = ['tsx, scss, test.ts'];
        
        prompts.inject([components, 'tsx', 'scss', extensions]);
        await buildReactComponent(options, []);
        
        const filePaths: string[] = await getFilePaths(components.split(" "), extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    it('should generate components passed by user as argument', async () => {
        const components = ['Menu', 'Button', 'Slider'];
        const extensions = ['tsx, scss, test.ts'];

        prompts.inject(['tsx', 'scss', extensions]);
        await buildReactComponent(options, components);

        const filePaths: string[] = await getFilePaths(components, extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    it('should not generate any files', async () => {
        const components = 'Menu Button Slider';
        const extensions = ['tsx, scss, test.ts'];

        prompts.inject([components, 'tsx', 'scss', []]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths(components.split(" "), extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeFalsy();
        }
    });
    
    it('should create files without templates', async () => {
        const options = {
            'template': false,
            'path': dir
        };
        
        const component = "TestComponent";
        const extensions = ['tsx', 'css', 'test.js'];

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {        
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
            await fs.readFile(file, 'utf8', ((err: ErrnoException | null, data: string) => {
                expect(err).toBeNull();
                expect(data).toBe('');
            }));
        }
    });

    it('should create files with tsx template', async () => {
        const options = {
            'template': true,
            'path': dir,
            'functional': false
        };

        const component = "TestComponent";
        const extensions = ['tsx', 'css'];
        const template = await getTsxTemplate(component, 'css');

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);
        
        const componentPath = path.join(dir, component, component.concat(`.tsx`));
        const stylesheetPath = path.join(dir, component, component.concat(`.css`));
        
        let pathExists = await fs.pathExists(componentPath);
        expect(pathExists).toBeTruthy();
        pathExists = await fs.pathExists(stylesheetPath);
        expect(pathExists).toBeTruthy();
        
        await fs.readFile(componentPath, 'utf8', ((err: ErrnoException | null, data: string) => {
            expect(err).toBeNull();
            expect(data).toBe(template);
        }));
    });

    it('should create files with jsx template', async () => {
        const options = {
            'template': true,
            'path': dir,
            'functional': false
        };

        const component = "TestComponent";
        const extensions = ['jsx', 'css'];
        const template = await getJsxTemplate(component, 'css');

        prompts.inject([component, 'jsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const componentPath = path.join(dir, component, component.concat(`.jsx`));
        const stylesheetPath = path.join(dir, component, component.concat(`.css`));

        let pathExists = await fs.pathExists(componentPath);
        expect(pathExists).toBeTruthy();
        pathExists = await fs.pathExists(stylesheetPath);
        expect(pathExists).toBeTruthy();

        await fs.readFile(componentPath, 'utf8', ((err: ErrnoException | null, data: string) => {
            expect(err).toBeNull();
            expect(data).toBe(template);
        }));
    });
    
    it('should create files with functional tsx template', async () => {
        const options = {
            'template': true,
            'path': dir,
            'functional': true
        };

        const component = "TestComponent";
        const extensions = ['tsx', 'css'];
        const template = await getFunctionalTsxTemplate(component, 'css');

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const componentPath = path.join(dir, component, component.concat(`.tsx`));
        const stylesheetPath = path.join(dir, component, component.concat(`.css`));

        let pathExists = await fs.pathExists(componentPath);
        expect(pathExists).toBeTruthy();
        pathExists = await fs.pathExists(stylesheetPath);
        expect(pathExists).toBeTruthy();

        await fs.readFile(componentPath, 'utf8', ((err: ErrnoException | null, data: string) => {
            expect(err).toBeNull();
            expect(data).toBe(template);
        }));
    });

    it('should create files with functional jsx template', async () => {
        const options = {
            'template': true,
            'path': dir,
            'functional': true
        };

        const component = "TestComponent";
        const extensions = ['jsx', 'css'];
        const template = await getFunctionalJsxTemplate(component, 'css');

        prompts.inject([component, 'jsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const componentPath = path.join(dir, component, component.concat(`.jsx`));
        const stylesheetPath = path.join(dir, component, component.concat(`.css`));

        let pathExists = await fs.pathExists(componentPath);
        expect(pathExists).toBeTruthy();
        pathExists = await fs.pathExists(stylesheetPath);
        expect(pathExists).toBeTruthy();

        await fs.readFile(componentPath, 'utf8', ((err: ErrnoException | null, data: string) => {
            expect(err).toBeNull();
            expect(data).toBe(template);
        }));
    });
    
    it('should generate jsx files', async () => {
        const component = "TestComponent";
        const extensions = ['jsx'];
        
        prompts.inject([component, 'jsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    
    it('should generate css stylesheets', async () => {
        const component = "TestComponent";
        const extensions = ['tsx', 'css', 'test.js'];

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    it('should generate scss stylesheets', async () => {
        const component = "TestComponent";
        const extensions = ['tsx', 'scss', 'test.js'];

        prompts.inject([component, 'tsx', 'scss', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    it('should generate sass stylesheets', async () => {
        const component = "TestComponent";
        const extensions = ['tsx', 'sass', 'test.js'];

        prompts.inject([component, 'tsx', 'sass', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
    });
    
    it('should not generate tests', async () => {
        const component = "TestComponent";
        const extensions = ['tsx', 'css'];

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
        const pathExists = await fs.pathExists(path.join(dir, `${component}.test.ts`));
        expect(pathExists).toBeFalsy();
    });
    
    it('should not generate stylesheets', async () => {
        const component = "TestComponent";
        const extensions = ['tsx'];

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
        const pathExists = await fs.pathExists(path.join(dir, `${component}.css`));
        expect(pathExists).toBeFalsy();
    });
    
    it('should not generate the component file', async () => {
        const component = "TestComponent";
        const extensions = ['css', 'test.ts'];

        prompts.inject([component, 'tsx', 'css', extensions]);
        await buildReactComponent(options, []);

        const filePaths: string[] = await getFilePaths([component], extensions);
        for(const file of filePaths) {
            const pathExists = await fs.pathExists(file);
            expect(pathExists).toBeTruthy();
        }
        const pathExists = await fs.pathExists(path.join(dir, `${component}.tsx`));
        expect(pathExists).toBeFalsy();
    });
});
