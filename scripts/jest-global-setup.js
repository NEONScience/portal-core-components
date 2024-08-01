const jestGlobalSetup = async () => {
  process.env.TZ = 'UTC';
};

export default jestGlobalSetup;
