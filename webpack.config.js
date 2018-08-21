/* global __dirname:false */

var DEBUG = process.argv.indexOf('-p') === -1;
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = [
  {
    entry: './src/main.js',
    // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
    devtool: DEBUG ? 'cheap-module-source-map' : false,
    target: 'web',
    output: {
      path: __dirname,
      filename: 'clustergrammer-gl.js',
      libraryTarget: 'var',
      library: 'Clustergrammer2'
    },
    externals: {
      // 'jQuery': 'jquery',
      // 'lodash': '_',
      // 'underscore': '_',
      // 'd3': 'd3'
    },
    module: {
        rules: [
          // This applies the loader to all of your dependencies,
          // and not any of the source files in your project:
          {
            test: /node_modules/,
            loader: 'ify-loader'
          }
        ]

        // loaders: [
        //     {
        //       test: /\.js$/,
        //       loader: 'babel',
        //       query: {
        //         // presets: ['es2015']
        //       }
        //     }
        // ]
    },
    plugins: [
      new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development,
        // ./public directory is being served
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: './',
          index: 'index.html'
        }
      })
    ],
    "mode": "development",
    node: {
       fs: "empty"
    }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: __dirname,
        filename: 'clustergrammer-gl.node.js',
        libraryTarget: 'commonjs2',
        library: 'Clustergrammer2'
      },
      externals: {
        // 'jQuery': 'jQuery',
        // 'lodash': '_',
        // 'underscore': '_',
        // 'd3': 'd3'
      },
      module: {
          // loaders: [
          //     {
          //       test: /\.js$/,
          //       loader: 'babel',
          //       query: {
          //         // disabled presets es2015
          //         // presets: ['es2015']
          //       }
          //     }
          // ]
      },
      "mode": "development",
      node: {
         fs: "empty"
      }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: __dirname,
        filename: 'clustergrammer-gl.min.js',
        libraryTarget: 'var',
        library: 'Clustergrammer2'
      },
      externals: {
        'jQuery': 'jQuery',
        // 'lodash': '_',
        // 'underscore': '_',
        'd3': 'd3'
      },
      optimization: {
        minimize: true
      },
      "mode": "production",
      node: {
         fs: "empty"
      }
      // plugins:[
      //   new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }})
      // ],

      // module: {
      //     loaders: [
      //         {
      //           test: /\.js$/,
      //           loader: 'babel',
      //           query: {
      //             presets: ['es2015']
      //           }
      //         }
      //     ]
      // }
  },
  {
      entry: './src/main.js',
      // devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
      devtool: DEBUG ? 'cheap-module-source-map' : false,
      target: 'web',
      output: {
        path: __dirname,
        filename: 'clustergrammer-gl.node.min.js',
        libraryTarget: 'commonjs2',
        library: 'Clustergrammer2'
      },
      externals: {
        'jQuery': 'jQuery',
        // 'lodash': '_',
        // 'underscore': '_',
        'd3': 'd3'
      },
      optimization: {
        minimize: true
      },
      "mode": "production",
      node: {
         fs: "empty"
      }
      // plugins:[
      //   new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }})
      // ],
      // module: {
      //     loaders: [
      //         {
      //           test: /\.js$/,
      //           loader: 'babel',
      //           query: {
      //             presets: ['es2015']
      //           }
      //         }
      //     ]
      // }
  }
];
