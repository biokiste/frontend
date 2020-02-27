const httpProxyMiddleware = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    httpProxyMiddleware({
      target: process.env.API,
    })
  );
};
