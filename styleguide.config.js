module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    webpackConfig.devServer = {
      disableHostCheck: true,
    };
    return webpackConfig;
  },
  styleguideDir: "docs"
};
