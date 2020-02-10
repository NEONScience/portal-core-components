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

module.exports = override(
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addWebpackModuleRule(svgLoadRule)
);
