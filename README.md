# Portal Core Components

This is a library of react components to be used on pages for the NEON Data Portal.

Functional documentation can be found here:

https://data.neonscience.org/core-components


## Using Components

You don't need a copy of this project to use it!
(You _will_ need your git credentials to be up to date from the "git" command line, but they should be anyway.)

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
as on any third party platform. However, in order to work properly outside of NEON, two environment
variable must be set so that components that generate links do so properly.

**`REACT_APP_NEON_HOST_OVERRIDE`**

Set this environment variable to your host without a trailing slash (e.g. "https://myhost.org").

**`REACT_APP_FOREIGN_LOCATION`**

Set this environment variable to `true`.

The host envvar above is typically reserved for development purposes and will be ignored in
production *unless* the foreign location env var is true.

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
6. Add the new component to `src/lib_components/index.ts`
7. Run `npm run lib` to have the new component picked up and exported with the library

### NOTE: Verify new dependencies!

If you have added or modified third-party dependencies then it is important to verify they work from a fresh install before committing changes upstream.

Run `rm -rf node_modules && npm install` and re-run the app to validate a fresh install. This mimics how other apps importing `portal-core-components` will see your changes.

### Worker Caveats

This library does support workers in its current build process using `worker-loader`. To create a worker
name any worker file `*.worker.js`.

Note, however, that a bug in `react-app-rewired` can mean lint errors in workers may silently break
production builds but not development builds. See [here](https://github.com/timarney/react-app-rewired/issues/362) for details.

If you have added or modified a worker file and are seeing empty production builds then manually look for
and fix any lint errors using this command (from the root directory):

```
npx eslint ./PATH_TO_YOUR_WORKER_FILE -c ./node_modules/eslint-config-react-app/index.js
```

## Modifying Existing Components

Have nodejs.

Clone this project from git.  In the cloned directory, run:

    npm install

This should pick up everything from the package-lock.json file via the npm repos.

From there, you can use the usual

    npm start

to run a local instance.  Modify and deliver as normal.

For local development without needing to send things to git, you may want to check out the npm link command at https://docs.npmjs.com/cli/link.  This can cause some unexpected behaviors, so do some research before you try.

## Building the Library

After any additions or modifications to source the library must be rebuilt in order for the changes to be importable by other applications. Rebuild the library and generate TypeScript declaration files like so:

    npm run lib

This places all built asses in /lib.  These built components should be checked into git, so make sure to `git add` any appropriate new files in /lib.

### Windows Users: NODE_ENV fix

For Windows users the `npm run lib` command may fail with complaint about 'NODE_ENV' not being a recognized command. This is due to the Linux-based syntax of one of the node scripts for portal-core-components. This can be resolved by globally installing [win-node-env](https://www.npmjs.com/package/win-node-env):

    npm install -g win-node-env


## Library Composition

This package was configured with advice from [this article](https://medium.com/@lokhmakov/best-way-to-create-npm-packages-with-create-react-app-b24dd449c354).

In summary, it began as a create-react-app app that was ejected. A `babel.config.json` was added with minor configuration and a script to invoke babel to run a library build was added.

Components are then created in `src/lib_components/components`, each with its own `package.json` to "publish itself" within the library. Babel generates a `lib` directory with each component and a single `index.js` entry point that exports each individual component's entry point.


## Scripts Overview

* **`npm run start`**
    Compile a dev (non-optimized) build and start the portal-core-components app with it running on `http://localhost:3010/`

* **`npm run build`**
    Compile a production (optimized) build

* **`npm run test`**
    Run tests

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
