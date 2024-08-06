import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const jestGlobalSetup = async () => {
  process.env.TZ = 'UTC';

};

export default jestGlobalSetup;
