const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = (env, options) => {
  var isDevelop = options.mode === "development";
  isDevelop && console.log("You are running Webpack in Development mode");

  return {
    entry: {
      index: ["./src/index.tsx"],
    },
    output: {
      filename: "[name].[chunkhash].js",
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      host: "0.0.0.0",
      hot: false,
      historyApiFallback: true,
    },
    ...(isDevelop && { devtool: "source-map" }), // Conditionally add this prop
    optimization: isDevelop
      ? {}
      : {
          minimize: true,
        },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        title: "React Template Application",
        template: "./src/index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "config/**/*",
            context: "src",
          },
        ],
      }),
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, "/src"),
        path.resolve(__dirname, "node_modules/"),
      ],
      extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"],
    },
    node: {
      global: false,
    },
  };
};
