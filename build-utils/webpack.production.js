const paths = require('./paths');
const TypingsForCssModulesLoader = require.resolve(
  'typings-for-css-modules-loader'
);

module.exports = ({ mode }) => {
  return {
    mode,
    output: {
      publicPath: '/',
      path: paths.appBuild,
      filename: '[name].[hash].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: TypingsForCssModulesLoader,
              options: {
                importLoaders: 2,
                modules: true,
                namedExport: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [
                  require('postcss-import')({ root: './ src' }),
                  require("postcss-url"),
                  require("postcss-cssnext"),
                  require("postcss-browser-reporter")
                ]
              }
            }
          ]
        }
      ]
    },
  };
};
