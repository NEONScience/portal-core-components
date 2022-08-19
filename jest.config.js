module.exports = {
  verbose: true,
  roots: [
    '<rootDir>/src/',
  ],
  moduleNameMapper: {
    'typeface-inter': '<rootDir>/src/__mocks__/fileMock.js',
    '(pdfjs-dist/legacy/build/pdf.worker)': '<rootDir>/src/__mocks__/constructorMock.js',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  transform: {
    '\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileTransformer.js',
  },
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
