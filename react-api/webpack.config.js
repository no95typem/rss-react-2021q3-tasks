const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

const devServer = () =>
  isDevelopment
  ? {
      devServer: {
        hot: true, // enable HMR on the server
        historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
        inline: true,
        contentBase: path.join(__dirname, './'),
        watchContentBase: true,
      }
    }
  : {};

module.exports = {
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDevelopment ? '/' : '/',
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    rules: [
      {
        test: [/\.[tj]sx?$/],
        include: path.join(__dirname, 'src'),
        use: 'babel-loader',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-modules-typescript-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=assets/img/[contenthash].[ext]',
        ],
      },
    ],
  },
  ...devServer(),
  devtool: "cheap-module-source-map",
  plugins: [
    isDevelopment && new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html.ejs' }),
    !isDevelopment && new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      overrideConfigFile: '.eslintrc.js',
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references",
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/public' },
      ],
    }),
    !isDevelopment && new CleanWebpackPlugin({ cleanStaleWebpackAssets: false, protectWebpackAssets: false }),
    new webpack.DefinePlugin({
      "process.env": "{}",
    }),
  ].filter(Boolean),
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'crypto': 'crypto',
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: false,
          keep_fnames: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
};
