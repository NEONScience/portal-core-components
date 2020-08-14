const { override, useEslintRc, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

const svgLoadRule = {
  test: /\.svg$/,
  use: [
    { loader: 'svg-url-loader' },
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          {convertColors: {shorthex: false}}
        ]
      }
    }
  ]
};

/*
const workerLoadRule = {
  test: /\.worker\.js$/,
  use: {
    loader: 'worker-loader',
    options: {
      filename: '[name].[contenthash].worker.js',
      chunkFilename: '[id].[contenthash].worker.js',
    },
  },
}
*/

module.exports = override(
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addWebpackModuleRule(svgLoadRule),
  // addWebpackModuleRule(workerLoadRule),
);
