const DEBUG = process.argv.indexOf("-p") === -1;
const webpack = require("webpack");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const path = require("path");

const ENTRY_POINT = "./src/main.js";
const filePath = path.join(__dirname, "dist");
const packageFilename = "clustergrammer-gl";

const getConfig = (type, fileExtension, mode, exportType) => ({
  entry: ENTRY_POINT,
  devtool: DEBUG ? "cheap-module-source-map" : false,
  target: "web",
  output: {
    path: filePath,
    filename: `${packageFilename}.${fileExtension}`,
    library: {
      name: "CGM",
      type,
      ...(exportType ? { export: exportType } : {}),
    },
  },
  module: {
    rules: [
      // This applies the loader to all of your dependencies,
      // and not any of the source files in your project:
      {
        test: /node_modules/,
        loader: "ify-loader",
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
    ],
  },
  mode,
});

module.exports = [
  {
    ...getConfig("var", "js", "development"),
    plugins: [
      new BrowserSyncPlugin({
        // browse to http://localhost:3100/ during development,
        // ./example directory is being served
        host: "localhost",
        port: 3100,
        server: {
          baseDir: ".",
          index: "example/index.html",
        },
      }),
    ],
  },
  getConfig("var", "min.js", "production"),
  getConfig("commonjs2", "node.js", "development"),
  getConfig("commonjs2", "node.min.js", "production"),
];
