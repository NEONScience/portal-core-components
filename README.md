# Portal Shared

This is a library of shareable components for the Neon Portal.

It is a continuing work in progress with a lot of refinement available.  If you have modifications that will make it a better build, go for it!


## Using Components

You don't need a copy of this project to use it!
(You _will_ need your git credentials to be up to date from the "git" command line, but they should be anyway.)

In the target project directory, install this package with:

    npm install git+https://github.com/NEONScience/portal-shared#<branch>

So, develop would be:

    npm install git+https://github.com/NEONScience/portal-shared#develop

Once installed, components should be imported in code with:

    import { <component name> } from "portal-shared"

And used like any other component in the containing render() method.  See https://github.battelleecology.org/Portal/portal-page-template for an example.


## Adding a New Component

1. Create a new directory in `src/node_modules/components`
2. Build your component in this directory (e.g. `Component.js`, `Component.jsx`, etc.)
3. Add any other necessary assets (including additional components) in this directory as needed
4. Create a `package.json` file in this directory containing the following:
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
5. Add the new component to `src/node_modules/index.js`
6. Run `npm run lib` to have the new component picked up and exported with the library

### NOTE: Verify new dependencies!

If you have added or modified third-party dependencies then it is important to verify they work from a fresh install before committing changes upstream.

Run `rm -rf node_modules && npm install` and re-run the app to validate a fresh install. This mimics how other apps importing `portal-shared` will see your changes.

## Modifying Existing Components

Have nodejs.

Clone this project from git.  In the cloned directory, run:

    npm install

This should pick up everything from the package-lock.json file via the npm repos.

From there, you can use the usual

    npm start

to run a local instance.  Modify and deliver as normal.

For local development without needing to send things to git, you may want to check out the npm link command at https://docs.npmjs.com/cli/link.  This can cause some unexpected behaviors, so do some research before you try.

Once modified, rebuild the library like so:

    npm run lib

which will place the components in /lib.  These built components should be checked into git.

**NOTE: a Babel bug with a (now automated) workaround**

After running `npm run lib` there is a generated file a `/lib/index.js` containing exports. Note that the export lines should all look like this:

    exports.<component name> = _<component name>.default;

A bug from a translation that Babel makes during the build process originally generates these lines to look like this:

    exports.<component name> = _<component name>.<component name>;

Previously this had to be manually fixed after running  `npm run lib`. Currently this is no longer necessary as the run script includes a `sed` call to immediately edit the output file.

Keep an eye on this issue with Babel. Eventually it may get fixed upstream so that we can simplify the `lib` script to not include the ugly `sed` command.

**Note for macOS and sed, will need to install the gnu version of sed as the syntax is slightly different as well as regex handling**

- Install Homebrew
- Install gnu-sed package
  - `brew install gnu-sed`

Should now have the `gsed` executable installed for utilization.

See https://stackoverflow.com/questions/47059929/looking-for-errors-in-a-react-component-export-import.


## Library Composition

This package was configured with advice from [this article](https://medium.com/@lokhmakov/best-way-to-create-npm-packages-with-create-react-app-b24dd449c354).

In summary, it began as a create-react-app app that was ejected. A `.babelrc` was added with minor configuration and a script to invoke babel to run a library build was added.

Components are then created in `src/node_modules/components`, each with its own `package.json` to "publish itself" within the library. Babel generates a `lib` directory with each component and a single `index.js` entry point that exports each individual component's entry point.


## Scripts Overview

* **`npm run start`**
    Compile a dev (non-optimized) build and start the portal-shared app with it running on `http://localhost:3010/`

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
    Generate a library build (what other apps importing components from portal-shared as a library will use)
