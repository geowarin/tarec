# The Awesome REact CLI

Tarec takes care of your React build for you. No more googling and stitching boilerplates together. Just write your application.

## Features

Tarec takes all the best practices in the React community and makes them available to you via a Command-Line Interface (CLI).

* Babel 6 stage 0
* Tree-shaking with webpack 2
* Hot reloading with react-hmr
* Pre-configured loaders for all resources (images, fonts, json, ...)
* Separate bundles for vendors and application
* Cache-busting

## How-to

1. `npm install -g tarec`
2. Create a project with `src/index.js` as your entry point.
3. Add `react` and `react-dom` as dependencies.
4. Create an `index.html` file at the root of your project.
5. Write codez.
6. `tarec build`

Type `tarec` to get a dev-server with hot-reload and `tarec build` to generate the optimized version of your application
in the `dist` folder.

## Todo

* Babel aliases
* Starter project generation
* Plugins
* Static resources
* Configuration file and command-line switches
* Easy publishing on github pages
* React-Hot-Loader 3?
