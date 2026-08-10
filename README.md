<p align="center">
  <a href="https://www.neonscience.org" target="_blank"><img width="170" src="https://www.neonscience.org/themes/custom/neon/logo.svg" alt="NSF NEON Logo"></a>
</p>

# Portal Core Components

This is a library of React components to be used on pages for the NEON Data Portal.

Functional documentation can be found here:

https://data.neonscience.org/core-components


## Installation

Install the package in your project directory:

    npm install @neonscience/portal-core-components

## Using the Component Library

Once installed, components should be imported in code with one of:

```javascript
// Preferentially import specific components by default export
import ComponentName from '@neonscience/portal-core-components/components/ComponentName';
// Import component from top level exports
import { ComponentName } from '@@neonscience/portal-core-components';
```

### Using Components Outside of a NEON Domain

Portal Core Components are designed to be used throughout the NEON web application platform as well
as on any third party platform. API endpoints will autoconfigure to default values.
For further build-time and/or runtime based configuration options, see the NeonEnvironment component.

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

Refer to Material UI's theme documentation for further guidance.

#### Using Standalone Components Outside of an Application

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

## Portal Core Components Composition

This project is built as both an application and as a code/component library:

- The application: is built using NextJS as the framework, which provides a thin wrapper around the project and serves as a development environment. The application itself is for development, documentation, demonstration, and proving ground purposes. Production ready applications should be standalone applications that utilize the code library part of this project as a dependency.

- The code/component library: utilized as a dependency when creating applications that build on top of portal-core-components.

### Library Composition

The library code is created within the `src/lib_components` directory. SWC publishes the code to a `lib` directory that matches the directory structure within `src/lib_components`.

### Application Composition

The application code is a thin NextJS layer that allows rapid development of the library in the same way one would build any other NextJS application. Everything outside of the `src/lib_components` directory, with the exception of `StyleGuide` components.

## Contributing

Read the [contributing guide](https://github.com/NEONScience/portal-core-components/blob/HEAD/CONTRIBUTING.md) to learn about our development process, further information on composition and environment setup, how to build and test your changes, and how to test the generation of the library.

## Changelog

The [changelog](https://github.com/NEONScience/portal-core-components/releases) is updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).
