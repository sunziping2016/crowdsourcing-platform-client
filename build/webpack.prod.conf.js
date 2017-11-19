const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

let webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: '"production"'},
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      sourceMap: true
    }),
    new ExtractTextPlugin({filename: 'static/css/[name].[contenthash].css'}),
    new OptimizeCSSPlugin({cssProcessorOptions: {safe: true}}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.ejs',
      inject: true,
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true
      },
      chunksSortMode: 'dependency',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module, count) => (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      )
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'sw-cache-wxticket',
      filename: 'service-worker.js',
      staticFileGlobs: [],
      staticFileGlobsIgnorePatterns: [
        /\.map$/,
        /\.gz$/,
      ],
      mergeStaticsConfig: true,
      stripPrefix: 'dist/',
      minify: true,
      runtimeCaching: [
        {
          urlPattern: /^https?:\/\/fonts\.googleapis\.com\//,
          handler: 'cacheFirst'
        }
      ],
      ignoreUrlParametersMatching: [/./],
      verbose: true
    }),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        ['html','js','css'].join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
