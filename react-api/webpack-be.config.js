const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'node',
  resolve: {
    fallback: { http: false },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: './src/server/entry.tsx',
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist/server'),
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
        test: /\.d\.ts$/,
        loader: 'ignore-loader',
      },
      // {
      //   test: /\.(woff(2)?|eot|ttf|otf)$/i,
      //   type: 'asset/resource',
      //   use: webpack.IgnorePlugin,
      // },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // webpack.IgnorePlugin,
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
          // webpack.IgnorePlugin,
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
        //use: webpack.IgnorePlugin,
        use: [
          'file-loader?hash=sha512&digest=hex&name=assets/img/[contenthash].[ext]',
        ],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    !isDevelopment &&
      new ESLintPlugin({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        overrideConfigFile: '.eslintrc.js',
      }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: "write-references",
      },
    }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    // !isDevelopment && new CleanWebpackPlugin({ cleanStaleWebpackAssets: false, protectWebpackAssets: false }),
    new webpack.DefinePlugin({
      'process.env': '{}',
      IS_DEV: isDevelopment,
      IS_ONLINE: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/server/public', to: '../client/public' },
      ],
    }),
    isDevelopment &&
      new NodemonPlugin({
        // If using more than one entry, you can specify
        // which output file will be restarted.
        script: './dist/server/server.js',

        // What to watch.
        watch: path.resolve('./dist/server'),

        // // Arguments to pass to the script being watched.
        // args: ['demo'],

        // Node arguments.
        // nodeArgs: ['--debug=9222'],

        // Files to ignore.
        ignore: ['*.js.map'],

        // Extensions to watch.
        ext: 'js,njk,json',

        // // Unlike the cli option, delay here is in milliseconds (also note that it's a string).
        // // Here's 1 second delay:
        // delay: '1000',

        // Detailed log.
        verbose: true,

        // Environment variables to pass to the script to be restarted
        env: {
          NODE_ENV: 'development',
        },
      }),
  ].filter(Boolean),
  externals: [nodeExternals()],
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
