# create-react-components

 create-react-components allows you to easily build (multiple) react
 components.
 
 ## Contents
 
 * [Introduction](#introduction)
 * [Getting started](#getting-started)
 * [Arguments](#arguments)
 
 ## Introduction
 
 Inspired by [stencil](http://stenciljs.com/)'s component generator, create-react-components is a CLI application
 for generating (multiple) react components. It is designed to be easy to use while providing a great set of features,
 including:

- [x] Typescript and Javascript support
- [x] SCSS, SASS, and CSS support
- [x] Multiple component generation
- [x] File selection/deselection
 
## Getting started

### Installation

Install `create-react-components` globally:

```bash
npm i -g create-react-components
```

### Usage

1. Execute `create-react-components`

2. Insert component names

![Alt Text](https://github.com/P1NHE4D/create-react-components/blob/master/media/names.gif)

3. Select language

![Alt Text](https://github.com/P1NHE4D/create-react-components/blob/master/media/language.gif)

4. Select stylesheet language

![Alt Text](https://github.com/P1NHE4D/create-react-components/blob/master/media/stylesheet.gif)

5. Select files to generate

![Alt Text](https://github.com/P1NHE4D/create-react-components/blob/master/media/selection.gif)

You can also provide the name of the components as an argument:
```bash
create-react-components Slider Button Menu Switch
```

## Arguments

| Short flag | Long flag             | Description                  |
| :--------: | :--------------------:| :--------------------------: |
| -f         | --functional-template | Enable functional templates  |
| -p         | --path                | Specify components directory |
| -t         | --no-template         | Disable templates            |

