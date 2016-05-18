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
* Publish on github pages

## Documentation

Read [the documentation](http://geowarin.github.io/tarec/)

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

### Proxies

If you are targeting an api running on a different port or another host, it can be useful to create a proxy in development.

You can add as many proxies as you want in your `tarec.yml` file:

```yaml

proxies:
  - /api: http://localhost:8080

```

The above configuration will redirect every request made to `${yourServerUrl}/api` to `http://localhost:8080/api`

### Variable definitions

In your build process, it can be useful to define variables that will be available
from your application.

For instance, we can define an `API_URL` variable in the `tarec.yml` file:

```yaml
define:
  - API_URL: http://localhost:8080
  - API_URL2: ${ENV_VAR:http://localhost:9090}
```

In the above example, API_URL will be resolved as a string whose value is always
`http://localhost:8080`.

`API_URL2` will take its value from an environment variables
called `ENV_VAR` if it is defined, and default to `http://localhost:9090`, otherwise.

We can now use the variable directly in our application:

```javascript
console.log(API_URL);
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
* React-Hot-Loader 3?
