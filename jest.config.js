module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  roots: [
    '<rootDir>/src/',
  ],
  moduleNameMapper: {
    '@stomp/stompjs': '<rootDir>/src/__mocks__/fileMock.js',
    '@stomp/rx-stomp': '<rootDir>/src/__mocks__/fileMock.js',
    '(pdfjs-dist/build/pdf.worker.mjs)': '<rootDir>/src/__mocks__/constructorMock.js',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/src/__mocks__/svgMock.js',
    'react-markdown': [
      '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
      '<rootDir>/../node_modules/react-markdown/react-markdown.min.js',
    ],
  },
  transform: {
    '\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileTransformer.js',
  },
  // The dateformat module is in ES6 format and needs to be transformed.
  // Set Jest transform to ignore all node modules that aren't dateformat.
  transformIgnorePatterns: [
    "node_modules/(?!(dateformat|remark-gfm|micromark-.+|decode-named-character-reference|character-entities|mdast-.*|escape-string-regexp|unist-util-.*|markdown-.*|ccount|d3-[a-z]+)/)",
  ],
  globalSetup: '<rootDir>/scripts/jest-global-setup.js',
  setupFiles: [
    'jest-canvas-mock',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/lib/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/lib/',
  ],
  collectCoverage: true,
  coverageReporters: [
    'lcov',
    'text',
  ],
  coverageDirectory: 'test-coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coveragePathIgnorePatterns: [
    '/lib/',
    '/node_modules/',
    '/src/lib_components/remoteAssets/',
    '/src/lib_components/types/',
    '/src/lib_components/images/',
    '/src/lib_components/components/SiteMap/svg/',
    'src/sampleData',
    'StyleGuide',
  ],
};
