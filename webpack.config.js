const webpack = require('webpack');
const paths = require('./build-utils/paths');
const HtmlWepackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin/lib');
const TypingsForCssModules = require('typings-for-css-modules-loader');
const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const mergeWebpack = require('webpack-merge');
const presetConfig = require('./build-utils/loadPresets');
const Dotenv = require('dotenv-webpack');
const Path = require('path')


module.exports = ({ mode, presets } = { mode: 'dev', presets: [] }) => {
    return mergeWebpack(
    {
      mode,
      entry: './src/index.tsx',
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [ new TsconfigPathsPlugin({ configFile: './tsconfig.json' }) ]
      },
      module: {
        rules: [
          {
            test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 5000
                }
              }
            ]
          },
          { test: [/\.tsx?$/, /\.ts?$/], loader: 'ts-loader' }
        ]
      },
      plugins: [
        new HtmlWepackPlugin({
          inject: true,
          template: paths.appHtml
        }),
        new webpack.ProgressPlugin(),
        new Dotenv({
            path : Path.resolve(__dirname, './.env'),
            silent: false,
        }),
      ],
      devServer: {
          contentBase: Path.join(__dirname, 'public'),
      },
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};
