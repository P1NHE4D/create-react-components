 ### ⚠️ This project will no longer be updated! ⚠️
 
# generate-react-components

 generate-react-components allows you to easily generate (multiple) react
 components.
 
## Contents
 
 * [Introduction](#introduction)
 * [Getting started](#getting-started)
 * [Arguments](#arguments)
 
## Introduction
 
 Inspired by [stencil](http://stenciljs.com/)'s component generator, generate-react-components is a CLI application
 for generating (multiple) react components. It is designed to be easy to use while providing a great set of features,
 including:

- [x] Typescript and Javascript support
- [x] SCSS, SASS, and CSS support
- [x] Multiple component generation
- [x] File selection/deselection
 
## Getting started

### Installation

Install `generate-react-components` globally

```bash
npm i -g generate-react-components
```

or locally
```bash
npm i generate-react-components
```

### Usage

1. Execute `generate-react-components` or if installed locally `npx generate-react-components`

2. Insert component names

    ![Alt names](https://raw.githubusercontent.com/P1NHE4D/create-react-components/master/media/names.gif)

3. Select language

    ![Alt language](https://raw.githubusercontent.com/P1NHE4D/create-react-components/master/media/language.gif)

4. Select stylesheet language

    ![Alt stylesheet](https://raw.githubusercontent.com/P1NHE4D/create-react-components/master/media/stylesheet.gif)

5. Select files to generate

    ![Alt selection](https://raw.githubusercontent.com/P1NHE4D/create-react-components/master/media/selection.gif)

You can also provide the name of the components as an argument:
```bash
generate-react-components Slider Button Menu Switch
```

## Arguments

| Short flag | Long flag             | Description                  |
| :--------: | :--------------------:| :--------------------------: |
| -f         | --functional          | Enable functional templates  |
| -p         | --path <path/to/dir>  | Specify components directory |
| -t         | --no-template         | Disable templates            |

