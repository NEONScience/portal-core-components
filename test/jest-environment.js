// https://github.com/mswjs/jest-fixed-jsdom

import JsDomEnvironment from 'jest-environment-jsdom';

class JsDomEnvironmentCustom extends JsDomEnvironment {
  constructor(...args) {
    super(...args);
    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.ReadableStream = ReadableStream;
    this.global.Blob = Blob;
    this.global.Headers = Headers;
    this.global.FormData = FormData;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.fetch = fetch;
    this.global.structuredClone = structuredClone;
  }
}

export default JsDomEnvironmentCustom;
