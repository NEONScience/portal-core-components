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

const htmlLoadRule = {
  test: /\.html$/i,
  loader: 'html-loader',
};

module.exports = override(
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addWebpackModuleRule(svgLoadRule),
  addWebpackModuleRule(htmlLoadRule),
);
