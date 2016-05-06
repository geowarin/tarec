# The Awesome REact CLI

Tarec takes care of your React build for you. No more googling and stitching boilerplates together. Just write your application.

## Features

Tarec takes all the best practices in the React community and makes them available to you via a Command-Line Interface (CLI).

* Instant project generation
* Babel 6 stage 0
* Tree-shaking with webpack 2
* Hot reloading with react-hmr
* Pre-configured loaders for all resources (images, fonts, json, ...)
* Separate bundles for vendors and your code (css and js)
* Cache-busting
* Static resources
* Index.html fallback (for the router)
* Simple babel aliases configuration
* Simple plugins system to add support for sass or mocha

## How-to

1. `npm install -g tarec`
2. `mkdir my-react-app && cd my-react-app`
3. `tarec init`
3. `npm install`
4. `tarec start`

Use `tarec start` to launch a dev-server with hot-reload and `tarec build` to generate the optimized version of your application
in the `dist` folder.

## Configuration

### Static resources

All the files in the `public` directory of your project will be served by the dev server and will be copied
as-is int the `dist` directory.

### Babel aliases

Create a `tarec.yml` file and configure aliases like this:

```yaml

aliases:
  - components: ./src/components
  - reducers: ./src/reducers

```

### Plugins

Tarec has a powerful, yet simple plugin system.
Plugins can add new commands or modify existing commands.

For instance, [tarec-plugin-mocha-test](https://github.com/geowarin/tarec-plugin-mocha-test) adds support for mocha
and [tarec-plugin-sass](https://github.com/geowarin/tarec-plugin-sass) adds support for sass.

To use a plugin, install them as devDependencies and add them to your `tarec.yml` configuration file:

```yaml

plugins:
  - tarec-plugin-mocha-test
  - tarec-plugin-sass

```

You can also resolve local plugins:


```yaml

plugins:
  - ./myAwesomePlugin.js

```

## Todo

* Configuration file and command-line switches
* Easy publishing on github pages
* React-Hot-Loader 3?
