const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/api", {
      target: process.env.REACT_APP_MUZHIYUN_API_URL,
      changeOrigin: true,
      logLevel: "debug",
    })
  );
};
