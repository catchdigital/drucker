/* eslint-disable no-underscore-dangle */
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const _ImageminPlugin = require('imagemin-webpack-plugin').default;
const _SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const _HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const _MiniCssExtractPlugin = require('mini-css-extract-plugin');
const _StyleLintPlugin = require('stylelint-webpack-plugin');
const _ESLintPlugin = require('eslint-webpack-plugin');
const helpers = require('./helpers');

const MiniCssExtractPlugin = new _MiniCssExtractPlugin();

const StyleLintPlugin = new _StyleLintPlugin({
  configFile: path.resolve(__dirname, '../', '.stylelintrc'),
  context: helpers.componentsDir,
  files: '**/*.scss',
  failOnError: false,
  quiet: false,
});

const ESLintPlugin = new _ESLintPlugin({
  overrideConfigFile: path.resolve(__dirname, '../', '.eslintrc.yml'),
  context: helpers.componentsDir,
  files: '**/*.js',
  failOnError: false,
  quiet: false,
});

const ImageminPlugin = new _ImageminPlugin({
  disable: process.env.NODE_ENV !== 'production',
  externalImages: {
    context: imagePath,
    sources: glob.sync(path.resolve(imagePath, '**/*.{png,jpg,gif,svg}')),
    destination: imagePath,
  },
});

const SpriteLoaderPlugin = new _SpriteLoaderPlugin({
  plainSprite: true,
  spriteAttrs: {
    id: 'svgSprite',
  },
});

const ProgressPlugin = new webpack.ProgressPlugin();

const DotEnv = new Dotenv({
  path: '.env',
  example: '.env.example', // load .env.example if no path
});

const HtmlBundlerPlugin = new _HtmlBundlerPlugin({
  css: {
    filename: (fileInfo) => {
      const dest = helpers.getDest(fileInfo);
      return `./${dest.folder}/${dest.name}.css`;
    },
  },
});

module.exports = {
  ProgressPlugin,
  ImageminPlugin,
  MiniCssExtractPlugin,
  StyleLintPlugin,
  ESLintPlugin,
  SpriteLoaderPlugin,
  CleanWebpackPlugin: new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['!*.{png,jpg,gif,svg}'],
    cleanAfterEveryBuildPatterns: ['remove/**', '!js', '!*.{png,jpg,gif,svg}'],
  }),
  DotEnv,
  HtmlBundlerPlugin,
};
