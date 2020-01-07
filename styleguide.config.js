const path = require("path");

module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    webpackConfig.devServer = {
      disableHostCheck: true
    };
    return webpackConfig;
  },
  styleguideDir: "docs",
  ignore: ["**/*.spec.{js,jsx,ts,tsx}", "**/components/**/*Context.*"],
  require: [path.join(__dirname, "src/styles/index.css")]
};
