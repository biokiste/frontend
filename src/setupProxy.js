const httpProxyMiddleware = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    httpProxyMiddleware({
      target:
        process.env.NODE_ENV === "production"
          ? process.env.API_PRODUCTION
          : process.env.API_STAGING,
      changeOrigin: true,
    })
  );
};
