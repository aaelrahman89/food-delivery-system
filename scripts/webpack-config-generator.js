const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VuetifyLoaderPlugin } = require('vuetify-loader');
const webpack = require('webpack');
const Fibers = require('fibers');
const path = require('path');
const { apps, rootPath, buildPath, devServerPort } = require('./projectConfig');
const { merge } = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

function isDevelopmentMode(mode) {
  return mode == 'development';
}
function isProductionMode(mode) {
  return mode == 'production';
}

function generateAppConfig({
  mode,
  entryName,
  pageTitle,
  baseUrl,
  directory,
  isPwa,
}) {
  let config = {
    entry: {
      [entryName]: path.resolve(directory, 'src/main.nc.js'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: `${entryName}/index.html`,
        template: path.resolve(rootPath, 'apps/index-template.html'),
        minify: isProductionMode(mode),
        chunks: [entryName],
        templateParameters: {
          BASE_URL: `${baseUrl}/`,
          PAGE_TITLE: pageTitle,
          MANIFEST: isPwa
            ? `<link rel="manifest" href="${baseUrl}/manifest.json">`
            : '',
        },
      }),
    ],
  };
  if (isPwa) {
    config = merge(config, {
      plugins: [
        new InjectManifest({
          swSrc: path.resolve(directory, 'src/service-worker.ts'),
          compileSrc: true,
          swDest: path.resolve(buildPath, entryName, 'service-worker.js'),
          exclude: [/.*/],
        }),
        // new CopyWebpackPlugin({
        //   patterns: [
        //     {
        //       from: path.resolve(directory, 'src/service-worker.js'),
        //       to: path.resolve(buildPath, entryName, 'service-worker.js'),
        //     },
        //   ],
        // }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(directory, 'src/manifest.json'),
              to: path.resolve(buildPath, entryName, 'manifest.json'),
            },
          ],
        }),
      ],
    });
  }

  return config;
}

function commonConfig() {
  return {
    resolve: {
      extensions: ['.js', '.ts', '.vue'],
    },
    target: 'web',
    output: {
      path: buildPath,
      filename: 'consumer-assets/js/[name].[contenthash:8].js',
      chunkFilename: 'consumer-assets/js/[name].[contenthash:8].js',
      publicPath: '/',
    },
    stats: 'errors-warnings',

    module: {
      rules: [
        /* vue-loader  */
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        /* fonts-loader */
        {
          test: /\.(woff2?|eot|ttf|svg|otf)(\?.*)?$/,
          exclude: /images\/svg\/.*\.svg$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'consumer-assets/fonts/[name].[hash].[ext]',
          },
        },
        /* vue-style-loader */
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                url: true,
                esModule: false,
              },
            },
            'postcss-loader',
          ],
        },

        {
          test: /images\/svg\/.*\.svg$/,
          loader: 'svg-inline-loader',
          options: {
            // if an SVG seems broken, try fiddling with these settings
            removeTags: true,
            // default is removingTags = ['title', 'desc', 'defs', 'style']
            // removing 'defs' breaks some some svg files
            removingTags: ['title', 'desc', 'style'],
            // this is disabled as it breaks some svg files
            removeSVGTagAttrs: false,
            // this is ESSENTIAL so that svg ids do not collide
            idPrefix: true,
          },
        },

        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: true,
                esModule: false,
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  fiber: Fibers,
                },
                additionalData:
                  '@import "~@survv/commons/scss/vuetify-overrides.scss";',
              },
            },
          ],
        },

        {
          test: /\.sass$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: true,
                esModule: false,
              },
            },
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  fiber: Fibers,
                },
                additionalData:
                  '@import "~@survv/commons/scss/vuetify-overrides.scss"',
              },
            },
          ],
        },

        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                appendTsSuffixTo: [/\.ts\.vue$/],
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new VueLoaderPlugin(),

      new webpack.HashedModuleIdsPlugin({
        hashFunction: 'sha256',
        hashDigest: 'base64',
        hashDigestLength: 10,
      }),

      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(rootPath, 'packages/assets/public'),
            to: path.resolve(buildPath, 'consumer-assets'),
            toType: 'dir',
          },
        ],
      }),

      new VuetifyLoaderPlugin(),

      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 5,
        minChunkSize: 1024, // bytes
      }),
    ],
  };
}

function developmentConfig() {
  const [firstApp] = apps;
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      filename: 'consumer-assets/js/[name].js',
      chunkFilename: 'consumer-assets/js/[name].js',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]',
    },
    watchOptions: {
      aggregateTimeout: 3000,
    },
    devServer: {
      port: devServerPort,
      stats: 'minimal',
      open: true,
      hot: true,

      historyApiFallback: {
        rewrites: [
          // main entry
          { from: /^\/$/, to: `/${firstApp.entryName}/index.html` },

          ...apps.map(({ baseUrl, entryName }) => {
            return {
              from: new RegExp(`^${baseUrl}/service-worker.js`),
              to: `/${entryName}/service-worker.js`,
            };
          }),
          ...apps.map(({ baseUrl, entryName }) => {
            return {
              from: new RegExp(`^${baseUrl}/manifest.json`),
              to: `/${entryName}/manifest.json`,
            };
          }),
          ...apps.map(({ baseUrl, entryName }) => {
            return {
              from: new RegExp(`^${baseUrl}`),
              to: `/${entryName}/index.html`,
            };
          }),
          // error pages
          { from: /./, to: `/${firstApp.entryName}/index.html` },
        ],
      },
    },
    plugins: [new HotModuleReplacementPlugin(), new FriendlyErrorsPlugin()],
  };
}

function productionConfig() {
  return {
    mode: 'production',
    devtool: false,
    plugins: [
      // new ForkTsCheckerWebpackPlugin({
      //   vue: true,
      //   tslint: false,
      //   formatter: 'codeframe',
      //   checkSyntacticErrors: true,
      // }),
      new MiniCssExtractPlugin({
        filename: 'consumer-assets/css/[name].[contenthash].css',
        chunkFilename: 'consumer-assets/css/[id].[contenthash].css',
      }),
      new CleanWebpackPlugin(),
    ],
    // optimization: {
    //   moduleIds: 'hashed',
    //   splitChunks: {
    //     minChunks: 2,
    //     minSize: 20 * 1024,
    //     chunks: 'initial',
    //     cacheGroups: {
    //       // vendor: {
    //       //   name: 'vendor',
    //       //   test: /[\\/]node_modules[\\/]/,
    //       //   priority: -10,
    //       //   chunks: 'initial',
    //       // },
    //       deprecated: {
    //         name: 'deprecated',
    //         priority: -20,
    //         minChunks: 2,
    //         chunks: 'initial',
    //         reuseExistingChunk: true,
    //       },
    //     },
    //   },
    // },
  };
}

function generateWebpackConfig({ mode }) {
  const appConfigs = apps.reduce(
    (accumulator, { entryName, pageTitle, baseUrl, directory, isPwa }) => {
      return merge(
        accumulator,
        generateAppConfig({
          mode,
          entryName,
          pageTitle,
          baseUrl,
          directory,
          isPwa,
        })
      );
    },
    {}
  );

  if (isDevelopmentMode(mode)) {
    return merge(commonConfig(), developmentConfig(), appConfigs);
  }
  if (isProductionMode(mode)) {
    return merge(commonConfig(), productionConfig(), appConfigs);
  }

  return merge(commonConfig(), appConfigs);
}
module.exports = {
  generateWebpackConfig,
};
