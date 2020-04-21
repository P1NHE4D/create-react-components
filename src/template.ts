import { Extension } from './buildComponent';

export const getTsxTemplate = (componentName: string, stylesheet?: Extension) => `import * as React from "react";
import * as ReactDOM from "react-dom";
${stylesheet ? `import \'./${componentName}.${stylesheet}\';` : ''}

type ${componentName}Props = {};

type ${componentName}State = {};

export class ${componentName} extends React.Component<${componentName}Props, ${componentName}State> {
    state: ${componentName}State = {};
    
    render() {
        return (
            <div></div>
        );
    }
}

`;

export const getFunctionalTsxTemplate = (
    componentName: string,
    stylesheet?: Extension,
) => `import * as React from "react";
${stylesheet ? `import \'./${componentName}.${stylesheet}\';` : ''}

type ${componentName}Props = {};
export const ${componentName} = ({}: ${componentName}Props) => (
    <div></div>
);`;

export const getJsxTemplate = (componentName: string, stylesheet?: Extension) => `import React from "react";
import ReactDOM from "react-dom";
${stylesheet ? `import \'./${componentName}.${stylesheet}\';` : ''}

export class ${componentName} extends React.Component {

    render() {
        return (
            <div></div>
        );
    }
}
`;

export const getFunctionalJsxTemplate = (componentName: string, stylesheet?: Extension) => `import React from "react";
${stylesheet ? `import \'./${componentName}.${stylesheet}\';` : ''}

export const ${componentName} = (props) => {
    return (
        <div></div>
    );
};
`;

export const getTestTemplate = (componentName: string) => `import { ${componentName} } from './${componentName}'

describe('<${componentName}/>', () => {
    beforeEach(() => {});
    afterEach(() => {});
    
    it('should ...', async () => {});
});
`;
