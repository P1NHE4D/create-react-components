import {Extension} from "./generate";

export const getComponentBoilerplate = (componentName: string, stylesheet?: Extension) => `import React from 'react';
${stylesheet ? (`import \'./${componentName}.${stylesheet}\';`) : ''}
`;

export const getTestBoilerplate = (componentName: string) => `import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
`;