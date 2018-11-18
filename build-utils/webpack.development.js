const TypingsForCssModulesLoader = require.resolve('typings-for-css-modules-loader');
const Dotenv = require('dotenv-webpack');

module.exports = ({ mode }) => {
    return {
      devtool: 'source-map',
      output: {
        publicPath: '/',
        filename: 'bundle.js'
      },
      devServer: {
        historyApiFallback: true
      },
      module:{
        rules:[
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: TypingsForCssModulesLoader,
                options: {
                  importLoaders: 1,
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
      plugins: [
        new Dotenv({
          path: './.env', // Path to .env file (this is the default)
          safe: false,
        }),
      ]
    };
  };
