/* eslint-disable no-undef */
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args.map(String).join(' ');
    const state = expect.getState();
    throw new Error(
      [
        'Error detected.',
        `Test: ${state.currentTestName ?? 'unknown'}`,
        '',
        message,
      ].join('\n'),
    );
  });
});
afterEach(() => {
  jest.restoreAllMocks();
});
