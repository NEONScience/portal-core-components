# Portal Core Components

This is a library of react components to be used on pages for the NEON Data Portal.

Functional documentation can be found here:

https://data.neonscience.org/core-components


## Using Components

In the target project directory, preferentially install this package with a versioned release tag:

    npm install github:NEONScience/portal-core-components#tag

So, v1.0.0 would be:

    npm install github:NEONScience/portal-core-components#v1.0.0

In the target project directory, install this package for a particular branch:

    npm install github:NEONScience/portal-core-components#branch

So, develop would be:

    npm install github:NEONScience/portal-core-components#develop

For more information on GitHub URL's, see NPM documentation: https://docs.npmjs.com/files/package.json#github-urls

Once installed, components should be imported in code with one of:

```javascript
// Preferentially import specific components by default export
import ComponentName from "portal-core-components/lib/components/ComponentName";
// Import component from top level exports
import { <component name> } from "portal-core-components"
```

And used like any other component in the containing render() method.

### Using Components Outside of a NEON Domain

Portal Core Components are designed to be used throughout the NEON web application platform as well
as on any third party platform. However, in order to work properly outside of NEON, environment
variables must be set to reference the appropriate API endpoints.

#### Development

**`REACT_APP_NEON_API_HOST_OVERRIDE`**

Set this environment variable to the desired API host without a trailing slash (e.g. "https://data.neonscience.org"). Note that this is a build time environment variable and if set within `.env.production` will impact *all* deployments.

#### Production

By default, the production build will use the appropriate production values for the API host. To customize based on runtime environment variables, will need to inject the following object into the DOM prior to the application's initialization (e.g. inject into the static HTML server side or equivalent):

```javascript
window.NEON_SERVER_DATA = {
  NeonPublicAPIHost: 'https://data.neonscience.org',
  NeonWebHost: 'https://www.neonscience.org',
};
```

#### Theming and Contexts Outside of a NEON Domain

All components rely on a customized Material UI Theme for styles and many components make use of
custom React contexts to pre-load commonly used data asychronously. By design, all Portal Core
Components are built to be as atomic as possible. As such, any components that require being wrapped
in the NEON Theme or in one or more Portal Core Components Contexts will automatically detect if
those resourcesare present and, if not, self-wrap.

Put another way, Portal Core Components *are* atomic and can be used without having to worry about
wrapping them in additional resources unless the documentation specifically states otherwise.

## Adding a New Component

1. Create a new directory in `src/lib_components/components`
2. Build your component in this directory (e.g. `Component.js`, `Component.jsx`, etc.), ensure default export
3. Add any other necessary assets (including additional components) in this directory as needed
4. Create `index.js`, `index.d.ts` files in this directory containing the following:
    ```
    export { default } from './YourComponent';
    ```
5. Create a `package.json` file in this directory containing the following:
    ```
    {
      "private": true,
      "name": "your-component",
      "main": "./YourComponent.jsx",
      "module": "./YourComponent.js"
    }
    ```
    * `main` should point to the _pre-compiled_ entry point for your component
    * `module` should point to the _post-compiled_ entry point for your component (always ".js")
    * If the entry point is the _same pre- and post-compile_ then use only `main` to point to the common entry point
    * Use kebab-case for `name`
    * Use CamelCase for files
6. If desirable to export the component at the library level, add the new component to `src/lib_components/index.ts`
7. Run `npm run lib` to have the new component picked up and exported with the library

### NOTE: Verify new dependencies!

If you have added or modified third-party dependencies then it is important to verify they work from a fresh install before committing changes upstream.

Run `rm -rf node_modules && npm ci` and re-run the app to validate a fresh install. This mimics how other apps importing `portal-core-components` will see your changes.

### Using Workers in Components

This library supports parallel processing using web workers for components by using [Parallel.js](https://parallel.js.org/).

To see how workers are currently in use in this library, see `src/lib_components/workers`. Example:

```
import Parallel from 'paralleljs';

export default function myWorker(argument) {
  const worker = new Parallel(argument);
  return worker.spawn((inData) => {
    /* do processing to generate outData */
    return outData;
  });
}
```

A worker like this could then be imported elsewhere and used with promise-stype syntax. Example:

```
import myWorker from 'path/to/workers/myWorker.js';

myWorker.then((result) => {
  /* do stuff with result */
});
```

Critical rules for this worker pattern:

* **Only put worker files in `src/lib_components/workers`.**
* **Only define one worker function per worker file.**
* **A worker file should only import Parallel and nothing else.**  
  Any logic inside of `worker.spawn` will have no access to external definitions, even if defined in the worker file.
  
And most important: **Always test the lib export!**

How a worker runs when developing core-components locally and how it runs when pulled in through the
lib export in another app are *very* different. The former uses run-time webpack and the latter uses
babel only, along with whatever bundling toolchain is in use by the other app.

If you have developed a worker but find it is not working when pulled in as a lib export, run a clean
lib build and then inspect the transpiled worker file in `lib/workers`. Look for any babel polyfill
definitions that appear outside of `worker.spawn` but are used inside. This is the most common reason
a worker fails to perform when pulled in through core components as an app dependency.

The lib build for core components includes a step to migrate any babel polyfills (other than the one
for `import` used to import Parallel.js) directly into the worker logic. This migration is not perfect.
If it missed something that it should have caught please update `lif-fix-worker-babel.js` to suit.


## Modifying Existing Components

Have nodejs.

Clone this project from git.  In the cloned directory, run:

    npm ci

This should pick up everything from the package-lock.json file via the npm repos.

From there, you can use the usual

    npm start

to run a local instance.  Modify and deliver as normal.

For local development without needing to send things to git, you may want to check out the npm link command at https://docs.npmjs.com/cli/link.  This can cause some unexpected behaviors, so do some research before you try.


## Testing

### Running Tests

Portal Core Components has a suite of unit and snapshot tests run via [Jest](https://jestjs.io/).

To run the entire test suite:

    npm run test

Note that with snapshot testing there are several components with stored snapshots containing DOM trees. These are expected to fall out of sync with components as those components are updated. If you see failing snapshot tests then inspect the failures carefully to make sure they express differences that are expected given updated to those components. If there are unexpected differences, or snapshot tests fail for components that have not changed, then there is unintended breakage somewhere (and the snapshot tests are doing their job!)

To update **all** snapshots (after confirming all failures are expected from recent development) run:

    npm run test:updateSnapshots

When tests are run test coverage information is generated. This appears in the shell and can also be found formatted as HTML pages in the `test_coverage` directory.

### Writing Tests

The Jest configuration will pick up all javascript files in a `__tests__` directory. By convention, for portal-core-components, every file that has accompanying unit tests should have an adjacent `__tests__` folder containing any/all test files, and each test file should bear the same name as the source file it is testing.

Example:

    src/
    | App.jsx
    | __tests__/
    | |  App.jsx
    | lib_components/
    | | components/
    | | | MyComponent/
    | | | | MyComponent.jsx
    | | | | __tests__/
    | | | | | MyComponent.jsx
    | | | OtherComponent/
    | | | | OtherComponent.jsx
    | | | | __tests__/
    | | | | | OtherComponent.jsx

Several mocks exist for testing any part of the core components library that may need them. These can be found in `~/src/__mocks__`. See README.md in that directory for details.

## Building the Library

After any additions or modifications to source the library must be rebuilt in order for the changes to be importable by other applications. Rebuild the library and generate TypeScript declaration files like so:

    npm run lib

This places all built asses in /lib.  These built components should be checked into git, so make sure to `git add` any appropriate new files in /lib.

### Windows Users: NODE_ENV fix

For Windows users the `npm run lib` command may fail with complaint about 'NODE_ENV' not being a recognized command. This is due to the Linux-based syntax of one of the node scripts for portal-core-components. This can be resolved by globally installing [win-node-env](https://www.npmjs.com/package/win-node-env):

    npm install -g win-node-env


## Library Composition

This package was originally configured with advice from [this article](https://medium.com/@lokhmakov/best-way-to-create-npm-packages-with-create-react-app-b24dd449c354).

In summary, it began as a create-react-app app that was ejected. A `babel.config.json` was added with minor configuration and a script to invoke babel to run a library build was added.

Components are then created in `src/lib_components/components`, each with its own `package.json` to "publish itself" within the library. Babel generates a `lib` directory with each component and a single `index.js` entry point that exports each individual component's entry point.


## Scripts Overview

* **`npm run start`**
    Compile a dev (non-optimized) build and start the portal-core-components app with it running on `http://localhost:3010/`

* **`npm run build`**
    Compile a production (optimized) build

* **`npm run test`**
    Run all unit and snapshot tests

* **`npm run test:updateSnapshots`**
    Run all unit and snapshot tests while also updating all snapshot tests (i.e. all snapshot tests will pass by being updated)

* **`npm run lint`**
    Run the linter to get a summary of all lint errors and warnings.
    NOTE: This script always exits 0, even when there are lint errors, to prevent a confusing NPM error from appearing at the end of the output

* **`npm run lint:fix`**
    Run the linter to automatically fix all automatically fixable lint issues and get a summary of everything that's left.
    NOTE: This script always exits 0, even when there are lint errors, to prevent a confusing NPM error from appearing at the end of the output

* **`npm run lib`**
    Generate a library build and TypeScript delcaration files (what other apps importing components from portal-core-components as a library will use)

* **`npm run lib:babel-build`**
    Generate a library build using Babel, sans TypeScript delcaration files

* **`npm run lib:types`**
    Utilize TypeScript compiler to generate delcaration files
