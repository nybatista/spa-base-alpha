import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

import  SpyneCmsServerWebpackPlugin  from '../spyne-plugin-json-cms-tmp/spyne-cms-server-webpack-plugin.js';

//const SpyneCmsServerWebpackPlugin = require('@franciscobatista/spyne-plugin-json-cms/spyne-cms-server-webpack-plugin');


const _defaultAssetsDirName = 'assets';
//const port = 8056;

let mode;
let _isProduction;
let _buildType;

// USE "/./" FOR ROOT DOMAIN OR "./" FOR RELATIVE DOMAIN PATHS"
let _relativeRoot = './';
let _publicPath;
let _assetsFolder;
let _imgPath;
let _iframesPath;
//let _staticDir;
//let _fontsDir;
let _testMode = false;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env = { mode: 'development' }) => {
  // Determine environment and build flags from CLI or environment vars
  mode = env.mode || 'development';
  _isProduction = env.build === true; // e.g., called via: `webpack --env build`
  _buildType = process.env.buildType;

  // For production, use a relative path if desired
  _publicPath = _isProduction ? _relativeRoot : '/';
  _assetsFolder = _isProduction ? `${_defaultAssetsDirName}/` : '';
  _imgPath = `${_publicPath}${_assetsFolder}static/imgs/`;
  // _staticDir = `${_publicPath}${_assetsFolder}static/`;
  // _fontsDir = `${_publicPath}${_assetsFolder}static/fonts/`;
  const sassStaticDir = _isProduction ? `././../static/` : './static/';
  _iframesPath = `${_publicPath}${_assetsFolder}static/iframes/`;
  _testMode = mode === 'none';

  const config = {
    // Webpack mode: 'development' | 'production' | 'none'
    mode,

    // Entry point(s) for the application
    entry: {
      index: './src/index.js',
    },

    // Output bundle settings
    output: {
      filename: `${_assetsFolder}js/[name].js`,
      publicPath: _publicPath,
      clean: true,
      crossOriginLoading: 'anonymous', // optional
    },

    // Source map settings (can tweak as needed)
    devtool: _isProduction ? 'source-map' : 'source-map',

    // Webpack Dev Server config
    devServer: {
      static: {
        directory: 'src', // Serve static files from ./src in dev
      },
      historyApiFallback: true,
      port: 'auto',
    },

    // Load plugins
    plugins: getWebpackPlugins(),

    // Basic code splitting config
    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },

    // Loaders: handle .html, .css, .sass, fonts, images, etc.
    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            minimize: false,
            esModule: false,
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            _isProduction !== true
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                url: false,
              },
            },

            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                additionalData:
                  '$STATIC_DIR: ' + JSON.stringify(sassStaticDir) + ';',
                sassOptions: {
                  fiber: false,
                  includePaths: [`${_assetsFolder}static/fonts/`],
                },
              },
            },
          ],
        },
        {
          test: /\.(ttf|woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: `${_assetsFolder}static/fonts/[name][ext][query]`,
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset',
          generator: {
            filename: `${_assetsFolder}static/imgs/[name].[ext]`,
          },
        },
        {
          test: /\.json$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `${_assetsFolder}static/data/[name].[ext]`,
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          use: 'raw-loader',
        },
      ],
    },

    // Short-path aliases for imports
    resolve: {
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/'),
        imgs: path.resolve(__dirname, 'src/static/imgs/'),
        svgs: path.resolve(__dirname, 'src/static/imgs/svgs/'),
        iframes: path.resolve(__dirname, 'src/static/iframes/'),
        fonts: path.resolve(__dirname, 'src/static/fonts/'),
        data: path.resolve(__dirname, 'src/static/data/'), // Possibly simplify
        css: path.resolve(__dirname, 'src/css/'),
        core: path.resolve(__dirname, 'src/core/'),
        traits: path.resolve(__dirname, 'src/app/traits/'),
        channels: path.resolve(__dirname, 'src/app/channels/'),
        components: path.resolve(__dirname, 'src/app/components/'),
        node_modules: path.resolve(__dirname, 'node_modules/'),
      },

      extensions: ['.js', '.css'],
    },
  };

  return config;
};

function getWebpackPlugins() {
  const definePlugin = new webpack.DefinePlugin({
    IMG_PATH: JSON.stringify(_imgPath),
    IFRAMES_PATH: JSON.stringify(_iframesPath),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  });

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html',
    minify: false,
  });

  const miniCssPlugin = () =>
    new MiniCssExtractPlugin({
      filename: `${_assetsFolder}css/main.css`,
    });

  const spyneCmsServerPlugin = ()=>{
    console.log("CMS SERVER PLUGIN ")

    return new SpyneCmsServerWebpackPlugin('localhost', 3010);

  }

  const getCopyPatternsPlugin = () => {
    const patterns = [
      { from: './src/static/imgs', to: `${_assetsFolder}static/imgs` },
      { from: './src/static/fonts', to: `${_assetsFolder}static/fonts` },
    ];

    if (_buildType === 'apache') {
      patterns.push({
        from: './apache-htaccess',
        to: '.htaccess',
        toType: 'file',
      });
    }

    return new CopyWebpackPlugin({ patterns });
  };

  const eslintPlugin = new ESLintPlugin({
    extensions: ['js'],
    fix: false,
    emitWarning: true,
  });

  if (_isProduction) {
    return [
      htmlPlugin,
      definePlugin,
      miniCssPlugin(),
      getCopyPatternsPlugin()
    ];
  } else if (_testMode === false) {
    return [htmlPlugin, definePlugin];
  } else {
    return [htmlPlugin, definePlugin];
  }
}
