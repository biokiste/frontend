const httpProxyMiddleware = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    httpProxyMiddleware({
      target: "http://localhost:1316"
    })
  );
};
