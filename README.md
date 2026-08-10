# Portal Core Components

This is a library of React components to be used on pages for the NEON Data Portal.

Functional documentation can be found here:

https://data.neonscience.org/core-components


## Using the Component Library

In the target project directory, preferentially install this package with a versioned release:

    npm install --save @neonscience/portal-core-components@VERSION

So, v3.0.0 would be:

    npm install --save @neonscience/portal-core-components@3.0.0

In the target project directory, install this package for a particular tag:

    npm install --save @neonscience/portal-core-components@TAG

So, develop would be:

    npm install --save @neonscience/portal-core-components@develop

For more information on GitHub URL's, see NPM documentation: https://docs.npmjs.com/files/package.json#github-urls

Once installed, components should be imported in code with one of:

```javascript
// Preferentially import specific components by default export
import ComponentName from "portal-core-components/lib/components/ComponentName";
// Import component from top level exports
import { <component name> } from "portal-core-components"
```

### Using Components Outside of a NEON Domain

Portal Core Components are designed to be used throughout the NEON web application platform as well
as on any third party platform. However, in order to work properly outside of NEON, environment
variables must be set to reference the appropriate API endpoints.

#### Development

**`NEXT_PUBLIC_NEON_API_HOST_OVERRIDE`**

Set this environment variable to the desired API host without a trailing slash (e.g. "https://data.neonscience.org"). Note that this is a build time environment variable and if set within `.env.production` will impact *all* deployments. Preferentially override this value with a local environment variable:

**`NEON_REACT_LOCAL_DEV_NEXT_PUBLIC_NEON_API_HOST_OVERRIDE`**

#### Production

By default, the production build will use the appropriate production values for the API host. 
For further runtime based configuration options, see the NeonEnvironment component.

#### Theming and Contexts Outside of a NEON Domain

All components rely on a customized Material UI Theme for styles and many components make use of
custom React contexts to pre-load commonly used data asychronously. By design, all Portal Core
Components are built to be as atomic as possible. As such, any components that require being wrapped
in one or more Portal Core Components Contexts will automatically detect if
those resources are present and, if not, self-wrap.

Portal Core Components rely on a Material UI theme being provided via a ThemeProvider.
This can be the customized NEON Theme provided by NeonThemeProvider, or any Material UI theme 
compatible with the version of Material UI that this library depends on,
with the caveat that it must adhere to the same NeonTheme type.

```javascript
const App = () => {
  return (
    <NeonThemeProvider>
      <YourApplicationRootComponent />
    </NeonThemeProvider>
  );
};

export default App;
```

Components that support being utilized outside the context of another application providing
the ThemeProvider wrapping, have "Standalone" versions of those components (eg, standalone subdirectory within the
particular component, ComponentNameStandalone), which provide the ThemeProvider wrapping explicitly.

```javascript
// Standalone SiteMap component example
const SiteMapStandalone = (inProps) => ((
  <NeonThemeProvider>
    <SiteMap {...inProps} />
  </NeonThemeProvider>
));

export default SiteMapStandalone;
```

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
lib export in another app are *very* different.

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

    npm run test:docker-update-snapshots

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

## Portal Core Components Composition

This project is built as both an application and as a code library:

- The application: is built using NextJS as the framework, which provides a thin wrapper around the project and serves as a development environment. The application itself is for development, documentation, demonstration, and proving ground purposes. Production ready applications should be standalone applications that utilize the code library part of this project as a dependency.

- The code library: utilized as a dependency when creating applications that build on top of portal-core-components.

## Building and Contribution Requirements

- Requires the latest LTS version of NodeJS
- Requires a Docker runtime to utilize Docker as a build environment independent of the local system

## Building the Library

After any additions or modifications to source the library must be rebuilt in order for the changes to be importable by other applications. Rebuild the library and generate TypeScript declaration files like so:

    npm run checks:docker

This places all built asses in /lib.  These built components should *not* be checked into git, but *should* be tested by way of running the portal-core-components application with:

    npm run start:lib

This targets the generated package directory when running the development server.

## Library Composition

The library code is created within the `src/lib_components` directory. SWC publishes the code to a `lib` directory that matches the directory structure within `src/lib_components`.

## Scripts Overview

* **`npm run start`**  
    Compile a dev (non-optimized) build and start the portal-core-components app with it running on `http://localhost:3010/core-components`

* **`npm run build`**  
    Compile a production (optimized) build of the application

* **`npm run test:docker"`**  
    Run all unit and snapshot tests
    - Requires `npm run build:docker-image` before performing Docker runtime environment based testing

* **`npm run test:docker-update-snapshots`**  
    Run all unit and snapshot tests while also updating all snapshot tests (i.e. all snapshot tests will pass by being updated)
    - Requires `npm run build:docker-image` before performing Docker runtime environment based testing

* **`npm run lint`**  
    Run the linter to get a summary of all lint errors and warnings.

* **`npm run lib:docker`**  
    Generate a library build and TypeScript delcaration files (what other apps importing components from portal-core-components as a library will use)
    - Requires `npm run build:docker-image` before performing Docker runtime environment based lib generation

* **`npm run checks:docker`**  
    Run all tasks related to this application and library, within a Docker runtime environment.
    - Generates library
    - Runs tests
    - Runs linter
    - Builds application
