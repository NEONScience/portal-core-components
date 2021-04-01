# Portal Core Components Mocks

This directory contains mocks that can be used in unit tests to stub out complex components and facilitate test development.


## NeonContext.js

Various tests cover modules that use NeonContext to get state/site/domain metadata. This mock emulated NeonContext by plugging in all fallback data and presenting itself as already "hydrated" (it will not trigger any fetches for cacheable data the way normal NeonContext does.

### Usage

```
import 'path/to/src/__mocks__/NeonContext';
```


## ajax.js

Use this mock to inject an arbitrary synchronous response wherever rjsx/ajax.getJSON is used.

### Usage

```
import { mockAjaxResponse, mockAjaxError } from 'path/to/src/__mocks__/ajax';

// Set a mock response (for ajax() AND ajax.getJSON() methods)
mockAjaxResponse({ ...response });

// Set a mock error (for ajax() AND ajax.getJSON() methods)
mockAjaxError('fail');
```


## fileMock.js

Super basic mock that returns a static stub string. This is used for stubbing the import of the primary typeface in the NEON Theme generally for all unit test suites, as defined in the top-level `package.json` for core-components.


## fileTransformer.js

Basic mock that converts a file import into a string reflecting the file name. This is used for stubbing the import of various file formats (such as images) generally for all unit test suites, as defined in the top-level `package.json` for core-components.


## mockReactComponent.jsx

General-purpose mock designed as a stand-in for any React component. When used the component in question will render out to snapshots as a `<div>` with with props mapped safely to HTML attributes. Children are kept intact and not mocked.

### Usage

```
import 'path/to/__mocks__/mockReactComponent';

jest.mock('path/to/Component', () => mockReactComponent('path/to/Component'));
```

### Example

Use this mock when snapshot tests are too complex and not due to what is actually being tested. A good example of this is when snapshot testing anything that makes use of Material UI Select or Material UI Slider. Those components, coming from a third party component library, do not require high-fidelity snapshot tests here. Also, the trees they render for snapshots are non-deterministic and complex. Here is how it would look to mock those two at the top of a test suite:

```
import 'path/to/__mocks__/mockReactComponent';

jest.mock('@material-ui/core/Select', () => mockReactComponent('@material-ui/core/Select'));
jest.mock('@material-ui/core/Slider', () => mockReactComponent('@material-ui/core/Slider'));
```

In the tree that renders for such a component the Select and Slider subtrees will be simple `<div>` tags with props and children intact. Props that cannot be rendered to strings cleanly (e.g. functions, objects with circular references, etc.) will be safely rendered out to a stub. All other props will render to strings to make for a meaningful snapshot tree.


## styleMock.js

Super basic mock that returns an empty object. This is used for stubbing the import of CSS files generally for all unit test suites, as defined in the top-level `package.json` for core-components.
